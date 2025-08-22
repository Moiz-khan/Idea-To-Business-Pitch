from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import requests
import json
from fastapi.middleware.cors import CORSMiddleware

os.environ["TRANSFORMERS_CACHE"] = "/code/backend/transformers_cache"
os.makedirs(os.environ["TRANSFORMERS_CACHE"], exist_ok=True)


# Initialization model immediately after server is Up!
device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.float16 if device == "cuda" else torch.float32

# TinyLlama/TinyLlama-1.1B-Chat-v1.0
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=dtype
)

model = model.to(device)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class PromptRequest(BaseModel):
    idea: str
    industry: str = "general"
    tone: str = "concise"
    length: str = "Medium"  # Options: Short, Medium, Long


def build_prompt(request: PromptRequest) -> str:
    return f"""
    Turn this startup idea into a JSON business pitch with keys:
    problem, solution, value_proposition, market, business_model, mvp_plan, go_to_market, risks.

    Idea: "{request.idea}"
    Industry: "{request.industry}"
    Tone: "{request.tone}"
    Length: "{request.length}"
    """


@app.post("/generate-prompt")
async def generate_prompt(req: PromptRequest):
    prompt = build_prompt(req)
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    try: 
        output = model.generate(
            **inputs,
            max_new_tokens=300,
            do_sample=True,
            temperature=1.0
        )
        text = tokenizer.decode(output[0], skip_special_tokens=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        parsed = json.loads(text)
        return {"sections": parsed}
    except Exception:
        import re
        m = re.search(r"\{[\s\S]*\}", text)
        if m:
            try:
                parsed = json.loads(m.group(0))
                return {"sections": parsed}
            except Exception:
                return {"raw": text}
        return {"raw": text}
    

@app.get("/health")
def get_health():
    return {"status": "Ok!"}
    
    
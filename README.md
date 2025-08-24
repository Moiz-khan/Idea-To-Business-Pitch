# 💡 Idea → Business Pitch  

Turn your raw idea into a structured business pitch in seconds!  

🔗 **Live Project:** [https://idea-to-business-pitch.vercel.app/](https://idea-to-business-pitch.vercel.app/)  

---

## 📖 About the Project  

Many young entrepreneurs start with promising ideas but struggle to convert them into clear, structured business pitches. This project bridges that gap by providing an **automated system** that transforms raw ideas into actionable business strategies.  

It is a **Minimum Viable Product (MVP)** that allows users to input their idea and industry, then generates a structured pitch using a HuggingFace language model.  

### ✨ Key Features  
- **Generate a Pitch** – Input your idea and industry to instantly generate a structured business pitch.  
- **Export to PDF** – Download a professional-looking PDF of your generated pitch.  
- **Recent Pitches** – Keep track of previously generated ideas for refinement.  
- **New Pitch Anytime** – Start fresh with a brand-new idea whenever needed.  

### 🚀 Benefits  
- **Accessible** – No login required, anyone can try it out.  
- **Fast** – Quickly transforms vague concepts into business-ready strategies.  
- **Practical** – Provides a pitch document ready to present to stakeholders.  
- **Scalable** – Can be expanded with collaboration tools, investor-focused summaries, and incubator integrations.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- React  
- TypeScript  
- Vite  
- Deployed on **Vercel**  

**Backend:**  
- Python (FastAPI)  
- HuggingFace (TinyLlama-1.1B-Chat-v1.0 model)  
- Docker  
- Deployed on **HuggingFace Server**  

---

## ⚙️ System Architecture  

![System Diagram](SystemDiagram.JPG)  

1. User interacts with the **Main Website Interface (Vercel)**.  
2. The frontend (React + TypeScript + Vite) sends requests to the backend.  
3. The **Vercel server** communicates with the **Hugging Face server**.  
4. The backend (**FastAPI**) passes the request to the HuggingFace **TinyLlama-1.1B** model.  
5. The processed response is returned back to the user as a structured business pitch.  

---

## 🖥️ How to Run Locally  

### Backend Setup  
```bash
# Move into backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8080
```

### Frontend Setup  
```bash
# Move into frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📌 Proof of Concept  

Users can access the platform **without login**.  
They provide:  
- Raw idea  
- Industry  
- Tone & length preferences  

The system sends this input to the backend, which uses the HuggingFace **TinyLlama-1.1B-Chat-v1.0** model with a max of **400 tokens** and **temperature = 1.0** for creativity and accuracy.  

The generated pitch includes:  
- Problem statement  
- Solution  
- Go-to-market strategy  
- Industry insights  
- Target audience  

Finally, users can **export the pitch as a PDF** or revisit their **recent pitches**.  

---

## 📄 License  
This project is open-source under the **MIT License**.  
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

import React, { useState } from "react";
import "./styles.css";

type Sections = {
    problem?: string
    solution?: string
    value_proposition?: string
    market?: string
    business_model?: string
    mvp_plan?: string
    go_to_market?: string
    risks?: string
    [k:string]: any
}


export default function App(){
    const [idea, setIdea] =  useState('')
    const [industry, setIndustry] =  useState('')
    const [loading, setLoading] = useState(false)
    const [Sections, setSections] = useState<Sections | null>(null)
    const [raw, setRaw] =  useState('')
    const [recentIdeas, setRecentIdeas] = useState<string[]>(["AI for Farmers"])

    function handleNewPitch() {
        if (idea.trim() !== "") {
            setRecentIdeas(prev => [idea, ...prev]);
        }
        setIdea("");
        setIndustry("");
        setRaw("");
    }

    function exportPDF() {
        const content = document.getElementById('output')?.innerHTML || '';
        const w = window.open('', '_blank');
        if (!w) {
            alert('Please allow popups for this site to export PDF.');
            return;
        }
        w.document.write('<html><head><title>Business Pitch</title></head><body>');
        w.document.write(content);
        w.document.write('</body></html>');
        w.document.close();
        w.print();
    }

    async function generate(){
        setLoading(true)
        setSections(null)
        setRaw('')

        try{
            const res = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}`: '/generate',
            {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {idea, industry, tone: 'concise', length: 'Medium'}
                )
            })
            const data = await res.json()
            if (data.sections)
                setSections(data.sections)
            else if (data.raw) 
                setRaw(data.raw)
        }catch(e: any){
            setRaw('Error: ' + String(e))
        }
        finally{setLoading(false)}
    }


    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-title">Idea2Pitch</div>
                <button className="sidebar-new-btn" onClick={handleNewPitch}>+ New Pitch</button>
                <div className="sidebar-recent-label">Recent</div>
                <ul className="sidebar-recent-list">
                    {recentIdeas.map((item, idx) => (
                        <li
                            key={idx}
                            className={`sidebar-recent-item${idx === 0 ? ' active' : ''}`}
                        >
                            {item.length > 32 ? item.slice(0, 32) + '...' : item}
                        </li>
                    ))}
                </ul>
                <div className="sidebar-footer">
                    <hr className="sidebar-footer-hr" />
                    <div>Settings</div>
                    <div className="sidebar-footer-help">Help & Feedback</div>
                </div>
            </aside>
            {/* Main Content */}
            <main style={{ flex: 1, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{
                    maxWidth: 600,
                    margin: '32px auto',
                    fontFamily: 'system-ui, sans-serif',
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 16px #e0e7ef',
                    padding: 32,
                    width: '100%',
                }}>
                    <h1 style={{fontWeight: 700, fontSize: 32, marginBottom: 8}}>Idea → Business Pitch</h1>
                    <p style={{color: '#555', marginBottom: 24}}>Paste your idea and click <b>Generate Pitch</b>. No login required.</p>
                    <label style={{fontWeight: 500, marginBottom: 6, display: 'block'}}>Your Idea</label>
                    <textarea
                        value={idea}
                        onChange={e => setIdea(e.target.value)}
                        rows={6}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            fontSize: 16,
                            marginBottom: 18,
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border 0.2s',
                        }}
                        placeholder="Describe your startup idea..."
                    />
                    <label style={{fontWeight: 500, marginBottom: 6, display: 'block'}}>Industry</label>
                    <input
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            fontSize: 16,
                            marginBottom: 24,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border 0.2s',
                        }}
                        placeholder="e.g. Agriculture, Fintech, Healthtech..."
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <button
                            onClick={generate}
                            disabled={loading}
                            style={{
                                padding: '12px 28px',
                                background: loading ? '#d1d5db' : '#2563eb',
                                color: loading ? '#888' : '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 18,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 1px 4px #e0e7ef',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate Pitch'}
                        </button>
                        <div style={{ flex: 1 }} />
                        <button
                            onClick={exportPDF}
                            disabled={loading}
                            style={{
                                padding: '8px 14px',
                                background: loading ? '#d1d5db' : '#2563eb',
                                color: loading ? '#888' : '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 18,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 1px 4px #e0e7ef',
                                transition: 'background 0.2s',
                            }}
                        >
                            Save → PDF
                        </button>
                    </div>

                    <div id="output" style={{marginTop: '20'}}>
                        {loading && <p>Working with model — please wait...</p>}
                        {raw && (
                            <div>
                                <h3>Business Pitch</h3>
                                <h5>Here is your business Pitch</h5>
                                <pre style={{whiteSpace: 'pre-wrap'}}>{raw}</pre>
                            </div>
                        )}
                        {Sections && (
                        <div>
                            {Object.entries(Sections).map(([k, v]) =>(
                                <section key={k} style={{border:'1px solid #eee', padding:12, marginBottom:10}}>
                                    <h3 style={{textTransform: 'capitalize'}}>{k.replace('_', ' ')}</h3>
                                    <textarea defaultValue={String(v)} style={{width:'100%', minHeight:80}}/>
                                </section>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}


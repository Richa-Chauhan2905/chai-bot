import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

origins = [
    "http://localhost:5173",
    "https://chai-bot-xscn.onrender.com",
    "https://chai-bot-cyan.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    text: str

with open("system-prompt.txt", "r", encoding="utf-8") as file:
    system_prompt = file.read()


@app.post("/")
def chat(prompt: Prompt):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt.text}
    ]

    response = client.chat.completions.create(
        model="gemini-2.0-flash",
        n=1,
        messages=messages,
    )

    return {response.choices[0].message.content}

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # 👈 loads .env into environment


app = FastAPI()
client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")

class ProductInput(BaseModel):
    title: str
    keywords: List[str]

@app.post("/ai/generate-description")
def generate_description(data: ProductInput):
    prompt = (
        f"Generate a compelling e-commerce product description for '{data.title}' "
        f"using the following keywords: {', '.join(data.keywords)}."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7,
    )

        description = response.choices[0].message.content
        return { "description": description }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

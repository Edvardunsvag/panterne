import { generateText } from "ai"
import { NextResponse } from "next/server"
import { azure } from "@/lib/azure-openai"
import { loadStoredQuestions, saveNewQuestions, StoredQuestion } from "@/app/data/generated-questions"

export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    // Load existing questions
    const storedQuestions = await loadStoredQuestions()
    const categoryQuestions = storedQuestions
      .map(q => q.question)

    const prompt = `Generate 10 random multiple-choice quiz questions about ${category} with 4 answer options each.
    
    Here are previously generated questions that you should NOT duplicate or rephrase:
    ${categoryQuestions.join('\n')}

    It should not be possible for a question to have the same two words as a previous question.

    Format the response as a JSON array with each question having the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option text",
      "source": "News source where this information comes from (e.g., CNN, BBC, Reuters)"
    }
    
    Make sure the questions:
    1. Are diverse and interesting
    2. Have the correct answer as one of the options
    3. Include a real and relevant news source
    4. Are COMPLETELY DIFFERENT from the previously generated questions listed above
    5. Cover different aspects of the topic than the previous questions. 
    6. Lastly, and this is important, always include at least one question that is a bit kinky or sexy. This should be the last question in the quiz.
    I repeat, always include at least one question that is a bit kinky or sexy. The question can be about something erotic you can do with your body. This should be the last question in the quiz. 
    7. One of the questions should be about the predatory mammal snow-mouse. The question should be about what is eats, does, lives, etc.
    8. Are COMPLETELY DIFFERENT from the previously generated questions listed above

    `

    // Using Azure OpenAI with our configured client
    const { text } = await generateText({
      model: azure('gpt-4o-mini'),
      prompt,
    })

    // Parse the response to get the questions
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse quiz questions from AI response")
    }

    const newQuestions = JSON.parse(jsonMatch[0])

    // Add metadata to new questions
    const questionsToStore: StoredQuestion[] = newQuestions.map(q => ({
      ...q,
      category,
      generatedAt: new Date().toISOString()
    }))

    // Store the new questions
    await saveNewQuestions(questionsToStore)

    return NextResponse.json({ questions: newQuestions })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 })
  }
}


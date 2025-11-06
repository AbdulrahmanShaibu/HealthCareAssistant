from flask import Flask, render_template, request, jsonify
from gtts import gTTS
import io
import base64

app = Flask(__name__)

# --- Predefined responses in Swahili ---
responses = {
    "hujambo": "Sijambo, karibu kwa Msaidizi wa Matibabu; eleza dalili zako kwa undani ili nikusaidie vizuri.",
    "habari": "Habari njema, natumai uko salama; niambie dalili unazohisi ili tuanze uchunguzi wa awali.",
    "homa": "Homa ni kupanda kwa joto la mwili kutokana na maambukizi kama malaria au mafua, pumzika, kunywa maji na pima hospitalini ikiwa itaendelea.",
    "malaria": "Malaria husababishwa na mbu, dalili ni homa, baridi, uchovu na jasho jingi; hakikisha unapima damu kabla ya kutumia dawa.",
    "kichwa": "Maumivu ya kichwa yanaweza kutokana na uchovu, msongo au shinikizo la damu; pumzika na nenda hospitali kama yanaendelea.",
    "tumbo": "Maumivu ya tumbo yanaweza kutokana na chakula kisicho salama, gesi au vidonda; kula chakula chepesi na wahi hospitali kama maumivu ni makali.",
    "vidonda vya tumbo": "Vidonda vya tumbo husababisha maumivu makali hasa ukiwa huna chakula tumboni; epuka pombe na vyakula vyenye viungo, nenda hospitali kwa matibabu.",
    "kikohozi": "Kikohozi kinaweza kuwa kikavu au chenye makohozi kutokana na mafua au maambukizi ya mapafu; kama kitaendelea zaidi ya wiki mbili, pima kifua.",
    "shinikizo la damu": "Shinikizo la damu ni hali ya damu kuwa nyingi kwenye mishipa; pima mara kwa mara, punguza chumvi na fanya mazoezi ya kila siku.",
    "kisukari": "Kisukari ni kupanda kwa sukari mwilini; dalili ni kiu, kukojoa mara kwa mara na uchovu, hivyo pima sukari na fuata lishe bora.",
    "kipindupindu": "Kipindupindu ni kuharisha maji mengi kama mchele kutokana na maambukizi; kunywa ORS na nenda hospitali mara moja.",
    "mzio": "Mzio ni mwitikio wa kinga kwa kitu kisicho hatari; unaweza kupata mafua au ngozi kuwasha, kuepuka kisababishi ni muhimu.",
    "msongo": "Msongo wa mawazo husababisha usingizi hafifu, mawazo mengi na uchovu; fanya mazoezi, pumzika na tafuta ushauri wa kitaalamu ikibidi.",
    "moyo": "Maumivu ya kifua yanaweza kuwa dalili ya matatizo ya moyo; kama maumivu yanaenda bega au mkono, nenda hospitali mara moja.",
    "kwaheri": "Kwaheri na asante kwa kutumia Msaidizi wa Matibabu; kumbuka afya njema inaanza na kujitunza kila siku."
}

# --- Function to pick a matching response ---
def get_response(text):
    text = text.lower()
    for key, resp in responses.items():
        if key in text:
            return resp
    return "Samahani, sielewi swali hilo. Tafadhali jaribu tena."

# --- Home route (serves your HTML page) ---
@app.route("/")
def home():
    return render_template("index.html")

# --- Main chatbot route ---
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_input = data.get("message", "")
    print("Received:", user_input)

    response = get_response(user_input)
    print("Response:", response)

    try:
        # Generate Swahili speech in memory (not on disk)
        tts = gTTS(response, lang='sw')
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        audio_base64 = base64.b64encode(mp3_fp.read()).decode("utf-8")
        print("Audio generated successfully")
    except Exception as e:
        print("TTS Error:", e)
        audio_base64 = None

    return jsonify({"response": response, "audio": audio_base64})

# --- Run app ---
if __name__ == "__main__":
    app.run(debug=True)

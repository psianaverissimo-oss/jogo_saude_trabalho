import { useState } from 'react';

// Foram removidas as importações do Supabase, já não precisamos delas!

const perguntas = [
  {
    texto: "Sobrecarga de tarefas — o que fazes primeiro?",
    imagem: "/1.webp",
    opcoes: [
      { texto: "Tento fazer tudo ao mesmo tempo", pontos: 0 },
      { texto: "Começo, mas perco o foco", pontos: 1 },
      { texto: "Defino prioridades antes de começar", pontos: 2 }
    ]
  },
  {
    texto: "Quando recebes um email com tom agressivo, como reages?", // Corrigido de "reactions"
    imagem: "/2.webp",
    opcoes: [
      { texto: "Respondo imediatamente", pontos: 0 },
      { texto: "Respondo depois de algum tempo para pensar", pontos: 1 },
      { texto: "Espero um tempo antes de responder e reflito", pontos: 2 }
    ]
  },
  {
    texto: "Cansaço logo de manhã — como te sentes?",
    imagem: "/3.png",
    opcoes: [
      { texto: "Já começo o dia sem energia", pontos: 0 },
      { texto: "Vou \"aguentando\" o dia apesar do cansaço", pontos: 1 }, // Corrigido de "the dia"
      { texto: "Consigo recuperar energia ao longo do dia", pontos: 2 }
    ]
  },
  {
    texto: "Desligar do trabalho — consegues?",
    imagem: "/4.avif",
    opcoes: [
      { texto: "Penso no trabalho à noite e no descanso", pontos: 0 },
      { texto: "Consigo desligar algumas vezes", pontos: 1 },
      { texto: "Consigo separar trabalho e vida pessoal", pontos: 2 }
    ]
  },
  {
    texto: "Pedidos extra de trabalho — como respondes?",
    imagem: "/5.jpg",
    opcoes: [
      { texto: "Aceito mesmo sem querer", pontos: 0 },
      { texto: "Aceito, mas fico sobrecarregado", pontos: 1 },
      { texto: "Avalio antes de aceitar", pontos: 2 }
    ]
  },
  {
    texto: "Falta de reconhecimento — como reages?",
    imagem: "/6.png",
    opcoes: [
      { texto: "Fico desmotivado", pontos: 0 },
      { texto: "Guardo para mim", pontos: 1 },
      { texto: "Falo sobre isso ou procuro solução", pontos: 2 }
    ]
  },
  {
    texto: "Erras no trabalho — o que fazes?",
    imagem: "7.jpg",
    opcoes: [
      { texto: "Critico-me muito", pontos: 0 },
      { texto: "Tento esconder o erro", pontos: 1 },
      { texto: "Aceito e resolvo rapidamente", pontos: 2 }
    ]
  },
  {
    texto: "Ritmo de trabalho — como é o teu dia?",
    imagem: "/8.jpg",
    opcoes: [
      { texto: "Só paro quando estou exausto", pontos: 0 },
      { texto: "Faço poucas pausas", pontos: 1 },
      { texto: "Faço pausas regulares", pontos: 2 }
    ]
  },
  {
    texto: "Conflitos na equipa — como reages?",
    imagem: "/9.webp",
    opcoes: [
      { texto: "Entro emocionalmente no conflito", pontos: 0 },
      { texto: "Evito, mas fico afetado", pontos: 1 },
      { texto: "Mantenho calma e procuro resolver", pontos: 2 }
    ]
  },
  {
    texto: "Frase que mais te representa hoje",
    imagem: "/10.webp",
    opcoes: [
      { texto: "“Tenho de aguentar”", pontos: 0 },
      { texto: "“Estou cansado, mas vou seguindo”", pontos: 1 },
      { texto: "“Consigo gerir melhor do que antes”", pontos: 2 }
    ]
  }
];

export default function App() {
  const [fase, setFase] = useState('landing');
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iniciarQuiz = () => setFase('quiz');

  const responder = (pontosDaOpcao) => {
    setPontuacao(pontuacao + pontosDaOpcao);
    
    if (perguntaAtual + 1 < perguntas.length) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      setFase('leads');
    }
  };

  // Movi o diagnóstico para cima para o podermos usar na hora de enviar o formulário
  const diagnostico = () => {
    if (pontuacao <= 6) return {
      titulo: "Modo sobrevivência emocional",
      texto: "Estás em esforço constante no trabalho. O teu sistema emocional pode estar em sobrecarga, o que afeta a tua energia, foco e capacidade de recuperação. Neste momento, estás mais em “aguentar” do que em viver o trabalho com equilíbrio." // Corrigido de "effort"
    };
    if (pontuacao <= 13) return {
      titulo: "Esforço elevado",
      texto: "Estás a funcionar, mas com desgaste emocional acumulado. Existem sinais de tensão interna e dificuldade em desligar do trabalho, o que pode estar a afetar o teu bem-estar e estabilidade emocional ao longo do tempo."
    };
    return {
      titulo: "Equilíbrio funcional", // Corrigido de "functional"
      texto: "Estás a conseguir gerir o trabalho com algum equilíbrio. Ainda assim, existem momentos de pressão e desgaste que mostram que o teu sistema emocional precisa de atenção para evitar acumulação de stress."
    };
  };

  const resultadoFinal = diagnostico();

  const verResultadoFinal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Nova ligação direta à API do Google Sheets
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

      // O mode 'no-cors' é o truque para não haver bloqueios de segurança entre o site e a Google
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pontuacao: pontuacao,
          diagnostico: resultadoFinal.titulo
        })
      });

      setFase('resultado');
    } catch (error) {
      console.error('Erro de telemetria:', error);
      // Avança na mesma para não travar a experiência do utilizador
      setFase('resultado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAE1] text-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* LANDING PAGE */}
      {fase === 'landing' && (
        <div className="text-center max-w-xl w-full flex flex-col items-center anima-pergunta px-4">
          <img 
            src="/logo.png" 
            alt="Ana Veríssimo Psicóloga" 
            className="w-full max-w-[450px] h-auto mb-10" 
          />
          <h1 className="text-3xl font-bold text-gray-950 mb-4 leading-tight">
            Autoavaliação Emocional no Trabalho
          </h1>
          <p className="text-gray-800 mb-10 max-w-sm">
            Descobre o impacto da tua rotina diária no teu bem-estar com este questionário rápido.
          </p>
          <button 
            onClick={iniciarQuiz}
            className="bg-[#4D6076] hover:opacity-95 text-white px-10 py-3.5 rounded-full font-semibold transition-all shadow-md text-sm"
          >
            Começar Experiência
          </button>
        </div>
      )}

      {/* QUIZ */}
      {fase === 'quiz' && (
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-gray-100 anima-pergunta">
          <div className="w-full h-48 bg-gray-200 relative">
            <img 
              key={`img-${perguntaAtual}`}
              src={perguntas[perguntaAtual].imagem} 
              alt="Ilustração da pergunta" 
              className="w-full h-full object-cover anima-pergunta"
            />
            <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              {perguntaAtual + 1} / {perguntas.length}
            </div>
          </div>
          
          <div key={perguntaAtual} className="p-6 flex flex-col items-center text-center anima-pergunta">
            <h2 className="text-xl font-bold text-gray-950 mb-6 leading-snug">
              {perguntas[perguntaAtual].texto}
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                <button 
                  key={index}
                  onClick={() => responder(opcao.pontos)}
                  className="bg-[#4D6076] hover:opacity-95 text-white font-medium px-6 py-4 rounded-md transition-all w-full shadow-sm text-sm"
                >
                  {opcao.texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CAPTAÇÃO DE LEADS */}
      {fase === 'leads' && (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 anima-pergunta text-center">
          <div className="text-[#4D6076] text-3xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-gray-950 mb-4">Se estas perguntas te fizeram refletir...</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-8">
            Não tens de caminhar a sós. Junta-te à nossa comunidade para receberes partilhas, ferramentas e estratégias sobre saúde mental no trabalho diretamente no teu e-mail.
          </p>
          
          <form onSubmit={verResultadoFinal} className="flex flex-col gap-4">
            <input 
              required
              type="email" 
              placeholder="O teu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:border-[#4D6076] outline-none text-sm transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#4D6076] text-white font-bold py-4 rounded-lg text-sm shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'A processar...' : 'Avançar para o Resultado'}
            </button>
            <p className="text-[10px] text-gray-400 mt-2 italic">Prometemos cuidar do teu e-mail com a mesma calma que cuidamos da mente.</p>
          </form>
        </div>
      )}

      {/* RESULTADOS OTIMIZADOS */}
      {fase === 'resultado' && (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 anima-pergunta flex flex-col">
          <div className="bg-[#4D6076] p-5 text-white flex items-center justify-between">
            <div className="pr-4">
              <h2 className="text-xl font-bold leading-tight">{resultadoFinal.titulo}</h2>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 flex flex-col items-center justify-center shrink-0">
              <span className="text-3xl font-extrabold">{pontuacao}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-80 mt-1">Pontos</span>
            </div>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            <p className="text-gray-700 text-sm leading-relaxed">
              {resultadoFinal.texto}
            </p>

            <div className="bg-[#f2f2ed] border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="w-full h-36 bg-gray-100 relative flex items-center justify-center border-b border-gray-100">
                <img src="/fim.jpeg" alt="Imagem de fim" className="w-full h-full object-cover" />
              </div>
              
              <div className="p-4">
                <p className="text-[15px] text-gray-950 font-bold mb-2 leading-tight">
                  Isto não é apenas “stress do trabalho”.
                </p>
                <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                  Se te identificaste com estes níveis, é um sinal de esforço emocional contínuo. Podes aprofundar isto comigo em consulta online e trabalhar formas de recuperar o teu equilíbrio diário.
                </p>

                <div className="flex flex-col gap-2">
                  <a 
                    href="https://wa.me/351913440424?text=Ol%C3%A1%20Ana!%20Fiz%20o%20question%C3%A1rio%20de%20sa%C3%BAde%20emocional%20e%20gostaria%20de%20marcar%20uma%20consulta." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#4D6076] hover:opacity-95 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    💬 Marcar Consulta (WhatsApp)
                  </a>
                  
                  <div className="flex gap-2">  
                    <a 
                      href="https://www.psi-anaverissimo.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-gray-950 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-all flex-1 flex items-center justify-center gap-2 shadow-sm"
                    >
                      🌐 Website
                    </a>
                    <a 
                      href="https://www.instagram.com/psi.anaverissimo" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-all flex-1 flex items-center justify-center shadow-sm"
                    >
                      📸 Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
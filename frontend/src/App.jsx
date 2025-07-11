import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [tickets, setTickets] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  const buscarTickets = () => {
    axios.get('http://127.0.0.1:8000/api/tickets/')
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar tickets:', error);
      });
  };

  useEffect(() => {
    buscarTickets();

    // Criar conexão WebSocket apenas uma vez
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onopen = () => {
      console.log('Conectado ao WebSocket');
    };

    socketRef.current.onmessage = (event) => {
      console.log('📥 Nova notificação:', event.data);
      buscarTickets();

      // Tocar som de alerta
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log('Erro ao tocar áudio:', err);
        });
      }
    };

    socketRef.current.onclose = () => {
      console.log('Desconectado do WebSocket');
    };

    socketRef.current.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    // Fechar conexão ao desmontar componente
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []); // <- somente no carregamento inicial

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoTicket = { titulo, descricao };

    axios.post('http://127.0.0.1:8000/api/tickets/', novoTicket)
      .then(() => {
        setTitulo('');
        setDescricao('');
        buscarTickets();  // atualiza a lista

        // Opcional: enviar notificação via WebSocket manualmente, 
        // se quiser continuar usando o frontend para isso
        // if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        //   socketRef.current.send(JSON.stringify({ tipo: 'novo_ticket', titulo }));
        // }

      })
      .catch(error => {
        console.error('Erro ao criar ticket:', error);
      });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📬 Help Desk - Chamados</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Enviar Chamado</button>
      </form>

      <h2>Chamados abertos</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id} style={{ marginBottom: '1rem' }}>
            <strong>{ticket.titulo}</strong><br />
            {ticket.descricao}<br />
            <em>{ticket.resolvido ? '✅ Resolvido' : '⏳ Pendente'}</em>
          </li>
        ))}
      </ul>

      {/* Alerta sonoro */}
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
        preload="auto"
      />
    </div>
  );
}

export default App;
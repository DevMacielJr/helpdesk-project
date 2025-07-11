import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tickets, setTickets] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoTicket = { titulo, descricao };

    axios.post('http://127.0.0.1:8000/api/tickets/', novoTicket)
      .then(() => {
        setTitulo('');
        setDescricao('');
        buscarTickets();  // atualiza a lista
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
    </div>
  );
}

export default App;

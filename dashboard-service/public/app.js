// ================================================
// BurgerApp v2 - Logic Central (Frontend)
// ================================================

// Configurações de endpoints (ajustar para o Render em produção)
const API_HOST = window.location.hostname || 'localhost';

const API_URLS = {
    order:        `http://${API_HOST}:3001/api`,
    payment:      `http://${API_HOST}:3002/api`,
    notification: `http://${API_HOST}:3003/api`
};

// Estado Global da Aplicação
let currentOrderId = null;
let currentTotal = 0;
let selectedMethod = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkConnections();
    setupEventListeners();
    startNotificationPolling();
});

// 1. VERIFICAÇÃO DE CONEXÃO
async function checkConnections() {
    const statusText = document.getElementById('status-text');
    const statusBox = document.getElementById('connection-status');

    console.log('Verificando conexões com:', API_URLS);

    try {
        const responses = await Promise.all([
            fetch(`${API_URLS.order.replace('/api', '')}/health`),
            fetch(`${API_URLS.payment.replace('/api', '')}/health`),
            fetch(`${API_URLS.notification.replace('/api', '')}/health`)
        ]);

        if (responses.every(r => r.ok)) {
            statusText.innerText = 'Online';
            statusBox.classList.replace('bg-red-700', 'bg-green-600');
            console.log('Todos os serviços estão Online');
        } else {
            throw new Error('Algum serviço retornou erro no health check');
        }
    } catch (e) {
        console.error('Erro ao verificar conexões:', e);
        statusText.innerText = 'Offline (Verifique os microsserviços)';
        statusBox.classList.replace('bg-green-600', 'bg-red-700');
    }
}

// 2. CONFIGURAÇÃO DE EVENTOS
function setupEventListeners() {
    document.getElementById('btn-criar-pedido').addEventListener('click', criarPedido);
    document.getElementById('btn-pagar').addEventListener('click', processarPagamento);
    document.getElementById('btn-limpar-notif').addEventListener('click', () => {
        document.getElementById('notifications-feed').innerHTML = '';
    });
}

// 3. FLUXO DE PEDIDO
async function criarPedido() {
    const tipoBurguer = document.getElementById('select-burger').value;
    const obs         = document.getElementById('obs-pedido').value;
    const adicionais  = Array.from(document.querySelectorAll('input[name="adicional"]:checked')).map(i => i.value);

    showLoading(true);

    try {
        const response = await fetch(`${API_URLS.order}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipoBurguer, adicionais, observacao: obs })
        });

        const data = await response.json();

        if (response.ok) {
            const pedido = data.pedido; // ← a API retorna { sucesso, pedido }, não os campos direto na raiz

            currentOrderId = pedido.id;
            currentTotal   = pedido.total;

            // Atualiza resumo
            document.getElementById('summary-id').innerText = `#${pedido.id.substring(0, 8)}`;
            document.getElementById('summary-total').innerText = pedido.total.toFixed(2);

            // Transição visual
            document.getElementById('step-1').classList.add('step-inactive');
            document.getElementById('step-2').classList.remove('step-inactive');
            
            addNotification('PEDIDO_CRIADO', `Pedido ${pedido.id.substring(0,8)} criado com sucesso!`);
        } else {
            alert('Erro ao criar pedido: ' + data.erro);
        }
    } catch (e) {
        console.error('Erro detalhado:', e);
        alert(`Erro de conexão com order-service\nURL: ${API_URLS.order}/pedidos\nDetalhes: ${e.message}`);
    } finally {
        showLoading(false);
    }
}

// 4. FLUXO DE PAGAMENTO
function selecionarMetodo(metodo) {
    selectedMethod = metodo;
    
    // UI feedback
    document.querySelectorAll('.metodo-pg').forEach(btn => {
        btn.classList.remove('border-blue-600', 'bg-blue-50');
    });
    document.querySelector(`[data-metodo="${metodo}"]`).classList.add('border-blue-600', 'bg-blue-50');
    
    document.getElementById('btn-pagar').classList.remove('hidden');
}

async function processarPagamento() {
    if (!currentOrderId || !selectedMethod) return;

    showLoading(true);

    try {
        const response = await fetch(`${API_URLS.payment}/pagamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pedidoId: currentOrderId,
                metodo: selectedMethod,
                total: currentTotal
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Notificar o serviço de notificações manualmente para simular integração
            enviarNotificacao('PEDIDO_CONFIRMADO', {
                pedidoId: currentOrderId,
                hamburguer: document.getElementById('select-burger').options[document.getElementById('select-burger').selectedIndex].text.split(' (')[0],
                pagamento: { metodo: selectedMethod.toUpperCase() }
            });

            alert('Pagamento aprovado! Seu pedido foi para a cozinha.');
            resetInterface();
        } else {
            alert('Erro no pagamento: ' + data.erro);
        }
    } catch (e) {
        alert('Erro de conexão com payment-service');
    } finally {
        showLoading(false);
    }
}

// 5. NOTIFICAÇÕES (Polling & Display)
async function startNotificationPolling() {
    setInterval(async () => {
        try {
            const response = await fetch(`${API_URLS.notification}/notificacoes`);
            const data = await response.json();
            const notificacoes = data.notificacoes || []; // ← a API retorna { sucesso, notificacoes }

            if (notificacoes.length > 0) {
                const feed = document.getElementById('notifications-feed');
                if (feed.innerText.includes('Aguardando')) feed.innerHTML = '';
            }
        } catch (e) {}
    }, 5000);
}

async function enviarNotificacao(evento, dados) {
    try {
        await fetch(`${API_URLS.notification}/notificacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ evento, ...dados })
        });
        
        addNotification(evento, `Status atualizado: ${evento.replace('_', ' ')}`);
    } catch (e) {}
}

function addNotification(type, message) {
    const feed = document.getElementById('notifications-feed');
    if (feed.innerText.includes('Aguardando')) feed.innerHTML = '';

    const time = new Date().toLocaleTimeString();
    const item = document.createElement('div');
    item.className = 'notification-item bg-gray-700 p-3 rounded-lg border-l-4 border-yellow-500';
    
    item.innerHTML = `
        <div class="flex justify-between text-[10px] text-gray-400 mb-1">
            <span class="font-bold text-yellow-500">${type}</span>
            <span>${time}</span>
        </div>
        <p class="text-sm text-gray-200">${message}</p>
    `;

    feed.prepend(item);
}

// UTILS
function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function resetInterface() {
    currentOrderId = null;
    selectedMethod = null;
    document.getElementById('step-1').classList.remove('step-inactive');
    document.getElementById('step-2').classList.add('step-inactive');
    document.getElementById('btn-pagar').classList.add('hidden');
    document.getElementById('obs-pedido').value = '';
    document.querySelectorAll('input[name="adicional"]').forEach(i => i.checked = false);
}

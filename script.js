let registros = JSON.parse(localStorage.getItem('impressoesEscola')) || [];

const LIMITES_COTA = {
    "Administração": 10000,
    "Coordenação": 8000,
    "Prof. YARA PALOMA": 3000,
    "Prof. SERGIO EDUARDO": 3000,
    "Prof. LUCIANA MAGDA": 3000,
    "Prof. MARINALVA ALVES": 3000,
    "Prof. MARGARETH CRISTINA": 3000,
    "Prof. HELIA MARA": 3000,
    "Prof. EDOMBERTO FREITAS": 3000,
    "Prof. AMANDA PRISCILLA": 3000,
    "Prof. VALESCA PARREIRAS": 3000,
    "Prof. MARIANA COSTA": 3000,
    "Prof. RAQUEL ENIR": 3000,
    "Prof. LUCIANE MARCOS": 3000,
    "Prof. HELOISA HELENA": 3000,
    "Prof. MARCELLE DE PAULA ": 3000,
    "Prof. DEBORA CRISTINA": 3000,
    "Prof. SILVIA MARIA": 3000,
    "Prof. FABIANA CHAVES": 3000,
    "Prof. PATRICIA NARDUCHI": 3000,
    "Prof. LENITA KATIA": 3000,
    "Prof. GREGORIO GOMES": 3000,
    "Prof. CELIA REGINA": 3000,
    "Prof. SILVANI GONCALVES": 3000,
    "Prof. LISIA MAURA ": 3000,
    "Prof. TATIANA MOURAA": 3000,
    "Prof. NATALIA MOTA": 3000,
    "Prof. DENIA MOREIR": 3000,
    "Prof. RUTENEIA ALVES": 3000,
    "Prof. MARLISE VIEIRA": 3000,
    "Prof. JESSICA GREGORIO": 3000,
    "Prof. MARIA LUCIA": 3000,
    "Prof. OLIVIA MOREIRA": 3000,
    "Prof. CAETANO ALMEIDA": 3000,
    "Prof. GISELLY BATISTA": 3000,
    "Prof. EUNICE APARECIDA": 3000,
    "Prof. ALINE TEODORO": 3000,
    "Prof. JOSEFA DE QUEIROZ": 3000,
    "Prof. MARIA DAS GRACAS": 3000,
    "Prof. ALEXANDRA MOURAO": 3000,
    "Prof. FABIO EUSTAQUIO": 3000,
    "Prof. ANDRE CHRISPIM": 3000,
    "Prof. LAURA MARQUES": 3000,
    "Prof. JORDAN RAMIRES": 3000,
    "Prof. DAVI DE ALMEIDA": 3000,
    "Prof. RENATA LIMA": 3000,
    "Prof. STELLA FERREIRA": 3000,
    "Prof. FABIANA MARQUES GOMES": 3000,
    "Prof. FABIO EDUARDO ": 3000,
    "Prof. VALÉRIA": 3000,
    "Monitora WANUCIA": 3000,
    "Monitora JHULIAN": 3000,
    "Monitora CELINA": 3000,
    "Monitora ANA CAROLINA": 3000,
    "Monitora QUEZIA": 3000
    // Adicione os outros professores aqui
};

function obterTodosRegistros() {
    const historicoAntigo = JSON.parse(localStorage.getItem('historicoImpressoesAntigas')) || [];
    let todos = [...registros];
    
    historicoAntigo.forEach(hist => {
        todos = todos.concat(hist.dados);
    });
    
    return todos;
}

function verificarViradaDeMes() {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    
    const ultimoMesRegistrado = localStorage.getItem('ultimoMesRegistrado');
    
    if (!ultimoMesRegistrado) {
        localStorage.setItem('ultimoMesRegistrado', `${mesAtual}-${anoAtual}`);
        return;
    }
    
    if (ultimoMesRegistrado !== `${mesAtual}-${anoAtual}`) {
        const historicoAntigo = JSON.parse(localStorage.getItem('historicoImpressoesAntigas')) || [];
        historicoAntigo.push({ mes: ultimoMesRegistrado, dados: registros });
        localStorage.setItem('historicoImpressoesAntigas', JSON.stringify(historicoAntigo));
        
        registros = [];
        localStorage.setItem('impressoesEscola', JSON.stringify(registros));
        localStorage.setItem('ultimoMesRegistrado', `${mesAtual}-${anoAtual}`);
        
        alert("Novo mês detectado! As cotas foram renovadas e os registros anteriores foram arquivados.");
        atualizarTela();
    }
}

function calcularUsoNoMes(nome, mesVerificar, anoVerificar) {
    const todos = obterTodosRegistros();
    let totalUsado = 0;
    
    for (let reg of todos) {
        if (reg.nome === nome && reg.mes === mesVerificar && reg.ano === anoVerificar) {
            totalUsado += reg.quantidade;
        }
    }
    
    return totalUsado;
}

function verificarCota() {
    const nomeInput = document.getElementById('nomeUsuario').value;
    const alertaCota = document.getElementById('alertaCota');
    
    let nomeReal = nomeInput;
    if (LIMITES_COTA[nomeInput] === undefined && LIMITES_COTA[nomeInput + " "] !== undefined) {
        nomeReal = nomeInput + " "; 
    }
    
    if (nomeInput && LIMITES_COTA[nomeReal] !== undefined) {
        const dataAtual = new Date();
        const limite = LIMITES_COTA[nomeReal];
        const usado = calcularUsoNoMes(nomeReal, dataAtual.getMonth() + 1, dataAtual.getFullYear());
        const restante = limite - usado;
        
        document.getElementById('nomeCotaTexto').innerText = nomeReal;
        document.getElementById('valorCotaTexto').innerText = restante;
        
        if (restante <= 0) {
            alertaCota.classList.add('esgotada');
        } else {
            alertaCota.classList.remove('esgotada');
        }
        
        alertaCota.style.display = 'block';
    } else {
        alertaCota.style.display = 'none';
    }
}

function registrarImpressao() {
    verificarViradaDeMes();
    
    const dataInput = document.getElementById('dataLancamento').value;
    const nomeInputEl = document.getElementById('nomeUsuario');
    const qtdInput = document.getElementById('qtdImpressoes');
    
    const nomeInput = nomeInputEl.value;
    const qtd = parseInt(qtdInput.value);
    
    if (!nomeInput) {
        alert("Por favor, informe um setor ou professor!");
        return;
    }

    let nomeReal = nomeInput;
    if (LIMITES_COTA[nomeInput] === undefined && LIMITES_COTA[nomeInput + " "] !== undefined) {
        nomeReal = nomeInput + " "; 
    }

    if (LIMITES_COTA[nomeReal] === undefined) {
        alert("⚠️ Nome inválido!\n\nPor favor, escolha um nome que esteja na lista sugerida ao digitar.");
        return;
    }
    
    if (isNaN(qtd) || qtd <= 0) {
        alert("Por favor, insira uma quantidade válida!");
        return;
    }

    let dataRegistro;
    if (dataInput) {
        const [ano, mes, dia] = dataInput.split('-');
        dataRegistro = new Date(ano, mes - 1, dia, 12, 0, 0); 
    } else {
        dataRegistro = new Date();
    }

    const mesRegistro = dataRegistro.getMonth() + 1;
    const anoRegistro = dataRegistro.getFullYear();

    const limite = LIMITES_COTA[nomeReal];
    const usado = calcularUsoNoMes(nomeReal, mesRegistro, anoRegistro);
    
    if (usado + qtd > limite) {
        const restante = limite - usado;
        alert(`❌ Impressão Bloqueada!\n\nA quantidade solicitada (${qtd}) ultrapassa o limite mensal para este mês (${mesRegistro}/${anoRegistro}).\n${nomeReal} só possui mais ${restante} folhas disponíveis.`);
        return; 
    }
    
    const novoRegistro = {
        id: Date.now(),
        nome: nomeReal,
        quantidade: qtd,
        dataCompleta: dataRegistro.toISOString(),
        dia: dataRegistro.getDate(),
        mes: mesRegistro,
        ano: anoRegistro
    };

    registros.push(novoRegistro);
    localStorage.setItem('impressoesEscola', JSON.stringify(registros));

    document.getElementById('dataLancamento').value = '';
    nomeInputEl.value = '';
    qtdInput.value = '';

    atualizarTela();
    verificarCota(); 
}

function excluirRegistro(idRegistro) {
    const indexAtual = registros.findIndex(reg => reg.id === idRegistro);
    
    if (indexAtual !== -1) {
        const reg = registros[indexAtual];
        if (confirm(`Tem certeza que deseja apagar o lançamento de "${reg.nome}" com ${reg.quantidade} folhas?`)) {
            registros.splice(indexAtual, 1);
            localStorage.setItem('impressoesEscola', JSON.stringify(registros));
            atualizarTela();
            verificarCota();
        }
        return;
    }

    const historicoAntigo = JSON.parse(localStorage.getItem('historicoImpressoesAntigas')) || [];
    let encontrouNoHistorico = false;

    for (let i = 0; i < historicoAntigo.length; i++) {
        const indexHist = historicoAntigo[i].dados.findIndex(reg => reg.id === idRegistro);
        if (indexHist !== -1) {
            const reg = historicoAntigo[i].dados[indexHist];
            if (confirm(`⚠️ MÊS FECHADO ⚠️\nTem certeza que deseja apagar o lançamento de "${reg.nome}" com ${reg.quantidade} folhas do arquivo antigo?`)) {
                historicoAntigo[i].dados.splice(indexHist, 1);
                localStorage.setItem('historicoImpressoesAntigas', JSON.stringify(historicoAntigo));
                atualizarTela();
                verificarCota();
            }
            encontrouNoHistorico = true;
            break;
        }
    }
    
    if (!encontrouNoHistorico) {
        alert("Erro: Lançamento não encontrado.");
    }
}

function apagarTudo() {
    if (registros.length === 0) {
        alert("O sistema já está vazio, não há o que apagar no mês atual.");
        return;
    }

    const confirmar = confirm("⚠️ ATENÇÃO EXTREMA ⚠️\n\nVocê está prestes a apagar TODOS os registros salvos neste mês.\nAs cotas de todos os professores voltarão ao limite máximo.\n\nTem certeza absoluta que deseja continuar?");
    
    if (confirmar) {
        registros = [];
        localStorage.setItem('impressoesEscola', JSON.stringify(registros));
        atualizarTela();
        verificarCota();
        alert("Todos os lançamentos do mês atual foram apagados.");
    }
}

function atualizarTela() {
    const dataInicioInput = document.getElementById('dataInicio').value;
    const dataFimInput = document.getElementById('dataFim').value;
    const usuarioFiltroInput = document.getElementById('usuarioFiltro').value; 
    
    let usuarioFiltroReal = usuarioFiltroInput;
    if (usuarioFiltroInput && LIMITES_COTA[usuarioFiltroInput] === undefined && LIMITES_COTA[usuarioFiltroInput + " "] !== undefined) {
        usuarioFiltroReal = usuarioFiltroInput + " "; 
    }

    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    const diaAtual = dataAtual.getDate();

    let somaPeriodo = 0;
    let somaMes = 0;
    let htmlLista = '';

    let dataInicioFilter = null;
    let dataFimFilter = null;

    if (dataInicioInput) {
        dataInicioFilter = new Date(dataInicioInput + 'T00:00:00');
    }
    if (dataFimInput) {
        dataFimFilter = new Date(dataFimInput + 'T23:59:59');
    }

    if (dataInicioFilter && !dataFimFilter) {
        dataFimFilter = new Date(dataInicioInput + 'T23:59:59');
    } else if (!dataInicioFilter && dataFimFilter) {
        dataInicioFilter = new Date(dataFimInput + 'T00:00:00');
    }

    const isFiltroPadrao = (!dataInicioFilter && !dataFimFilter);
    const isFiltroDiaUnico = (dataInicioInput && !dataFimInput) || (dataInicioInput && dataFimInput && dataInicioInput === dataFimInput);

    let mesRef = dataInicioFilter ? dataInicioFilter.getMonth() + 1 : mesAtual;
    let anoRef = dataInicioFilter ? dataInicioFilter.getFullYear() : anoAtual;

    const todosRegistros = obterTodosRegistros();

    for (let i = todosRegistros.length - 1; i >= 0; i--) {
        const reg = todosRegistros[i];
        const dataReg = new Date(reg.dataCompleta);
        
        const bateFiltroUsuario = (usuarioFiltroReal === "" || reg.nome === usuarioFiltroReal);
        
        if (bateFiltroUsuario) {
            
            if (reg.mes === mesRef && reg.ano === anoRef) {
                somaMes += reg.quantidade;
            }
            
            let mostrarRegistro = false;

            if (isFiltroPadrao) {
                if (reg.dia === diaAtual && reg.mes === mesAtual && reg.ano === anoAtual) {
                    mostrarRegistro = true;
                }
            } else {
                if (dataReg >= dataInicioFilter && dataReg <= dataFimFilter) {
                    mostrarRegistro = true;
                }
            }

            if (mostrarRegistro) {
                somaPeriodo += reg.quantidade;
                
                const diaFormatado = String(reg.dia).padStart(2, '0');
                const mesFormatado = String(reg.mes).padStart(2, '0');
                const dataExibicao = `${diaFormatado}/${mesFormatado}`;
                
                htmlLista += `
                    <div class="record">
                        <div class="record-user">
                            <strong>${reg.nome}</strong>
                            <span class="record-date">${dataExibicao}</span>
                        </div>
                        <div class="record-info">
                            <span>${reg.quantidade} folhas</span>
                            <button class="btn-deletar" onclick="excluirRegistro(${reg.id})" title="Excluir lançamento">🗑️</button>
                        </div>
                    </div>
                `;
            }
        }
    }

    const nomeTitulo = usuarioFiltroReal && LIMITES_COTA[usuarioFiltroReal] !== undefined ? ` - ${usuarioFiltroReal}` : '';
    let tituloEsq = 'Total Hoje';
    let tituloHist = 'Lançamentos de Hoje';

    if (!isFiltroPadrao) {
        if (isFiltroDiaUnico) {
            const [a, m, d] = (dataInicioInput || dataFimInput).split('-');
            tituloEsq = `Total em ${d}/${m}/${a}`;
            tituloHist = `Lançamentos de ${d}/${m}/${a}`;
        } else {
            const diaIn = String(dataInicioFilter.getDate()).padStart(2, '0');
            const mesIn = String(dataInicioFilter.getMonth() + 1).padStart(2, '0');
            const diaFim = String(dataFimFilter.getDate()).padStart(2, '0');
            const mesFim = String(dataFimFilter.getMonth() + 1).padStart(2, '0');
            tituloEsq = `Total no Período`;
            tituloHist = `Lançamentos (${diaIn}/${mesIn} até ${diaFim}/${mesFim})`;
        }
    }

    document.getElementById('tituloDia').innerText = tituloEsq + nomeTitulo;
    document.getElementById('tituloHistorico').innerText = tituloHist + nomeTitulo;
    
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    document.getElementById('tituloMes').innerText = `Total Mês (${meses[mesRef-1]})` + nomeTitulo;

    document.getElementById('totalDia').innerText = somaPeriodo.toLocaleString('pt-BR');
    document.getElementById('totalMes').innerText = somaMes.toLocaleString('pt-BR');
    
    const listaDiv = document.getElementById('listaRegistros');
    if (htmlLista) {
        listaDiv.innerHTML = htmlLista;
    } else {
        listaDiv.innerHTML = '<p class="no-records">Nenhum lançamento encontrado para este filtro.</p>';
    }
}

function limparFiltros() {
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    document.getElementById('usuarioFiltro').value = '';
    atualizarTela();
    document.getElementById('alertaCota').style.display = 'none'; 
}

window.onload = function() {
    verificarViradaDeMes();
    atualizarTela();
};
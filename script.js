const botaoAbrirFiltro = document.getElementById('abrir-filtro');

const botaoTipo = document.getElementById('button-tipo');

const closeButton = document.getElementById('close-button')

const dialogF = document.getElementById('dialog-filtro')

const header = document.getElementById("header")

const filterCount = document.getElementById('filter-count');

//URL e Main
//const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias?qtd=10&tipo=noticia"
const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias?qtd=10"

//const termoBusca = document.getElementById("search").value;

//
const main = document.querySelector("main")

//Header

botaoAbrirFiltro.addEventListener('click', () => {
    dialogF.showModal()
});

closeButton.addEventListener('click', () => {
    dialogF.close();
});

//Main

async function getBuscaData() {
    try {
        var selectBoxTipo = document.getElementById("button-tipo");
        var selectBoxQtd = document.getElementById("button-qtd");
        
        var selectedValueTipo = selectBoxTipo.options[selectBoxTipo.selectedIndex].value;
        var selectedValueQtd = selectBoxQtd.options[selectBoxQtd.selectedIndex].value;

        // Obtém a string de busca da URL
        const queryString = window.location.search;

        // Remove o ponto de interrogação da string de busca e decodifica os caracteres especiais
        const termoBusca = decodeURIComponent(queryString.slice(1));

        // Atualiza a URL da API com os valores selecionados e o termo de busca, se houver
        const searchParams = new URLSearchParams();
        searchParams.append('tipo', selectedValueTipo);
        searchParams.append('qtd', selectedValueQtd);
        if (termoBusca) {
            searchParams.append('busca', termoBusca);
        }

        const apiUrlSearch = `https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`;
        
        const response = await fetch(apiUrlSearch);
        const jsonDataSearch = await response.json();

        if (jsonDataSearch.items && jsonDataSearch.items.length > 0) {
            // Se houver resultados, atualiza o conteúdo principal
            updateMainContent(jsonDataSearch);
        } else {
            // Se não houver resultados, exibe uma mensagem de alerta
            semBusca();
        }
    } catch (error) {
        console.error("Ocorreu um erro ao buscar:", error);
    }
}


//VOLTA AO INÍCIO, CLICANDO NO HEADER
header.addEventListener('click', function () {

    const urlAtual = window.location.href;

    const urlSemSearch = urlAtual.split('?')[0];

    window.location.href = urlSemSearch;
});

function semBusca() {
    const divSB = document.createElement('div')
    const pSB = document.createElement('p')
    const pInicio = document.createElement('p')
    divSB.setAttribute('id', 'divSB');
    pSB.setAttribute('id', 'pSB');
    pInicio.setAttribute('id', 'pInicio');

    pSB.textContent = 'Nenhum resultado encontrado para a busca.'
    pInicio.textContent = 'Clique Aqui para voltar ao Início'

    // Adicionando um evento de clique ao elemento pInicio
    pInicio.addEventListener('click', function () {
        // Pegar a URL atual
        const urlAtual = window.location.href;
        // Remover a parte da URL após o caminho base
        const urlSemSearch = urlAtual.split('?')[0];
        // Redirecionar para a URL sem a parte da busca
        window.location.href = urlSemSearch;
    });

    divSB.appendChild(pSB)
    divSB.appendChild(pInicio)
    main.appendChild(divSB)
}



document.addEventListener('DOMContentLoaded', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const termoBusca = urlSearchParams.get('search');

    if (termoBusca) {
        // Se houver um termo de busca na URL, preenche o campo de busca com esse valor
        document.getElementById("search").value = termoBusca;

        getBuscaData(termoBusca);
    } else {
        asyncFoo();
    }
});
// Função para obter o total de notícias na API


async function asyncFoo() {

    try {
        const fetchedData = await fetch(apiUrl);
        const jsonData = await fetchedData.json();

        updateMainContent(jsonData);

    } catch (e) {
        main.innerHTML = `
            <div class="div">
                <h2>${JSON.stringify(e)}</h2>
            </div>
        `;
        console.log(e.message);
    }
}

document.getElementById("form-filtro").addEventListener("submit", async function() {

    await handleChange();
});

async function handleChange() {
    try {
        var selectBoxTipo = document.getElementById("button-tipo");
        var selectBoxQtd = document.getElementById("button-qtd");
        var inputDe = document.getElementById("button-de");
        var inputAte = document.getElementById("button-ate");
        
        var selectedValueTipo = selectBoxTipo.options[selectBoxTipo.selectedIndex].value;
        var selectedValueQtd = selectBoxQtd.options[selectBoxQtd.selectedIndex].value;
        var deValue = inputDe.value;
        var ateValue = inputAte.value;

        // Obtém o termo de busca da URL, se houver
        const queryString = window.location.search;
        const searchTerm = decodeURIComponent(queryString.slice(1));

        // Atualiza a URL da API com os valores selecionados e o termo de busca, se houver
        const searchParams = new URLSearchParams();
        searchParams.append('tipo', selectedValueTipo);
        searchParams.append('qtd', selectedValueQtd);
        if (searchTerm) {
            searchParams.append('busca', searchTerm);
        }
        if (deValue) {
            searchParams.append('de', deValue);
        }
        if (ateValue) {
            searchParams.append('ate', ateValue);
        }

        const apiUrlSearch = `https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`;
        
        const response = await fetch(apiUrlSearch);
        const jsonDataSearch = await response.json();

        if (jsonDataSearch.items && jsonDataSearch.items.length > 0) {
            // Se houver resultados, atualiza o conteúdo principal
            updateMainContent(jsonDataSearch);
            
            // Atualiza a URL com os parâmetros do filtro
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.pushState({}, '', newUrl);
        } else {
            // Se não houver resultados, exibe uma mensagem de alerta
            semBusca();
        }

      
    } catch (error) {
        console.error("Ocorreu um erro ao aplicar o filtro:", error);
    }
    updateFilterCount();
}
document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a contagem de filtros
    updateFilterCount();
  
});

function updateFilterCount() {

    const selectedValueTipo = document.getElementById("button-tipo").value;
    const deValue = document.getElementById("button-de").value;
    const ateValue = document.getElementById("button-ate").value;

    let count = 1; 

 
    if (selectedValueTipo !== "Selecione") count++;
    if (deValue) count++;
    if (ateValue) count++;
  
    filterCount.textContent = count;
    removerBotoesPaginacao() 
   
   
}




function formatarTempoDecorrido(dataPublicacao) {
    const dataAtual = new Date();

    // Verifica se dataPublicacao é uma string válida antes de tentar dividi-la
    if (typeof dataPublicacao !== 'string') {
        return 'Data de publicação inválida';
    }

    // Dividir a data_publicacao em partes para construir o objeto Date
    const partesData = dataPublicacao.split(' ');
    if (partesData.length !== 2) {
        return 'Data de publicação inválida';
    }

    const partesDataDDMMYYYY = partesData[0].split('/');
    if (partesDataDDMMYYYY.length !== 3) {
        return 'Data de publicação inválida';
    }

    const partesHora = partesData[1].split(':');
    if (partesHora.length !== 3) {
        return 'Data de publicação inválida';
    }

    // Construir o objeto Date com as partes extraídas
    const ano = parseInt(partesDataDDMMYYYY[2], 10);
    const mes = parseInt(partesDataDDMMYYYY[1], 10) - 1; // Mês começa com 0 (janeiro)
    const dia = parseInt(partesDataDDMMYYYY[0], 10);
    const hora = parseInt(partesHora[0], 10);
    const minuto = parseInt(partesHora[1], 10);
    const segundo = parseInt(partesHora[2], 10);

    // Verifica se os valores obtidos são numéricos e válidos
    if (
        isNaN(ano) || isNaN(mes) || isNaN(dia) ||
        isNaN(hora) || isNaN(minuto) || isNaN(segundo)
    ) {
        return 'Data de publicação inválida';
    }

    // Construir o objeto Date
    const dataPublicacaoObj = new Date(ano, mes, dia, hora, minuto, segundo);

    // Verifica se o objeto Date foi construído corretamente
    if (isNaN(dataPublicacaoObj.getTime())) {
        return 'Data de publicação inválida';
    }

    // Calcular diferença em milissegundos
    const diff = Math.abs(dataPublicacaoObj - dataAtual);
    const umDia = 24 * 60 * 60 * 1000;
    const numDias = Math.floor(diff / umDia);

    let tempoDecorrido = '';
    if (numDias === 0) {
        tempoDecorrido = 'Publicado hoje';
    } else if (numDias === 1) {
        tempoDecorrido = 'Publicado ontem';
    } else {
        tempoDecorrido = `Publicado há ${numDias} dias`;
    }

    return tempoDecorrido;
}

function adicionarPrefixoEditorias(editorias) {
    const editoriasFormatadas = [];
    for (const editoria of editorias) {
        editoriasFormatadas.push(`${editoria}`);
    }
    return editoriasFormatadas.join('');
}





async function getTotalNoticiasFiltradas() {
    try {
        const selectBoxTipo = document.getElementById("button-tipo");
        const selectedValueTipo = selectBoxTipo.options[selectBoxTipo.selectedIndex].value;
        const deValue = document.getElementById("button-de").value;
        const ateValue = document.getElementById("button-ate").value;

        const searchParams = new URLSearchParams();
        if (selectedValueTipo !== "Selecione") {
            searchParams.append('tipo', selectedValueTipo);
        }
        if (deValue) {
            searchParams.append('de', deValue);
        }
        if (ateValue) {
            searchParams.append('ate', ateValue);
        }

        const apiUrlFiltered = `https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`;

        const responseFiltered = await fetch(apiUrlFiltered);
        const jsonDataFiltered = await responseFiltered.json();

        const totalNoticiasFiltradas = jsonDataFiltered.count || 0;

        console.log(`Total de notícias que se encaixam nos filtros: ${totalNoticiasFiltradas}`);

        return totalNoticiasFiltradas;
    } catch (error) {
        console.error("Ocorreu um erro ao obter o total de notícias filtradas:", error);
        return 0;
    }
}

async function getTotalNoticiasRequisitadas() {
    try {
        const selectBoxTipo = document.getElementById("button-tipo");
        const selectBoxQtd = document.getElementById("button-qtd");
        const inputDe = document.getElementById("button-de");
        const inputAte = document.getElementById("button-ate");

        const selectedValueTipo = selectBoxTipo.options[selectBoxTipo.selectedIndex].value;
        const selectedValueQtd = selectBoxQtd.options[selectBoxQtd.selectedIndex].value;
        const deValue = inputDe.value;
        const ateValue = inputAte.value;

        const searchParams = new URLSearchParams();
        searchParams.append('qtd', selectedValueQtd);
        if (selectedValueTipo !== "Selecione") {
            searchParams.append('tipo', selectedValueTipo);
        }
        if (deValue) {
            searchParams.append('de', deValue);
        }
        if (ateValue) {
            searchParams.append('ate', ateValue);
        }

        const apiUrlSearch = `https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`;

        const response = await fetch(apiUrlSearch);
        const jsonDataSearch = await response.json();

        let totalNoticiasRequisitadas = 0;

        if (jsonDataSearch.items && jsonDataSearch.items.length > 0) {
            totalNoticiasRequisitadas = jsonDataSearch.items.length;
        } else {
            console.log("Nenhuma notícia encontrada com os critérios de busca.");
        }

        return totalNoticiasRequisitadas;
    } catch (error) {
        console.error("Ocorreu um erro ao obter o total de notícias requisitadas:", error);
        return 0;
    }
}















function removerBotoesPaginacao() {
    const divBotoesExistente = document.querySelector('.div-buttons');
    if (divBotoesExistente) {
        divBotoesExistente.remove();
    }
}





async function criarBotoesPaginacao() {
    try {
        // Obtém o total de notícias e notícias por página
        const totalNoticias = await getTotalNoticiasFiltradas();
        const noticiasPorPagina = await getTotalNoticiasRequisitadas();

        const totalPaginas = Math.ceil(totalNoticias / noticiasPorPagina);

        
        const urlParams = new URLSearchParams(window.location.search);
        const paginaAtual = parseInt(urlParams.get('pagina')) || 1;

        console.log('Total de notícias:', totalNoticias);
        console.log('Notícias por página:', noticiasPorPagina);
        console.log('Total de páginas:', totalPaginas);
        console.log('Pagina atual: ', paginaAtual)

        let inicio = paginaAtual - 5;

        let fim = paginaAtual + 4;

        if (inicio < 1) {
            inicio = 1;
            fim = Math.min(totalPaginas, 10);
        }

        if (fim > totalPaginas) {
            fim = totalPaginas;
            inicio = Math.max(1, totalPaginas - 9);
        }

        // Remove os botões de paginação existentes, se houver
        removerBotoesPaginacao();

        // Cria os botões de paginação
        const divBotoes = document.createElement('div');
        divBotoes.classList.add('div-buttons');

        const ulBotoes = document.createElement('ul');
        ulBotoes.classList.add('pagination');

        for (let i = inicio; i <= fim; i++) {
            const liBotao = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = i;

            if (i === paginaAtual) {
                liBotao.classList.add('pagina-atual');
                button.style.backgroundColor = '#4682b4'; 
                button.style.color = 'white';
            }

            button.addEventListener('click', async function() {
                const scrollY = window.scrollY;
            
                const newUrl = `${window.location.pathname}?pagina=${i}`;
                window.history.pushState({}, '', newUrl);
            
                const urlParams = new URLSearchParams(window.location.search); // Definindo urlParams
                removerBotoesPaginacao();
                 criarBotoesPaginacao();
              // Passando urlParams como argumento
                window.scrollTo(0, scrollY);
            });
            

            liBotao.appendChild(button);
            ulBotoes.appendChild(liBotao);
        }

        divBotoes.appendChild(ulBotoes);

        // Adiciona a divBotoes antes do footer e depois das notícias
        const mainContent = document.querySelector('main');
        mainContent.appendChild(divBotoes);

        return { inicio, fim };
    } catch (error) {
        console.error("Ocorreu um erro ao criar os botões de paginação:", error);
    }
}





// Dentro da função updateMainContent, você pode capturar esses valores
async function updateMainContent(data) {
    let html = '';
    const apiUrl = 'https://agenciadenoticias.ibge.gov.br/';

    if (data.items && data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
            const imagemStringificada = data.items[i].imagens;
            const caminhoDaImagem = JSON.parse(imagemStringificada).image_intro;

            if (caminhoDaImagem) {
                const urlImagem = apiUrl + caminhoDaImagem;

                const tempoDecorrido = formatarTempoDecorrido(data.items[i].data_publicacao);
                const editoriasFormatadas = adicionarPrefixoEditorias(data.items[i].editorias);

                html += `
                <div class="div">
                    <ul class="ul-noticia">
                        <li class="li1">
                            <a href="${urlImagem}" target="_blank">
                                <img src="${urlImagem}" alt="Imagem da Notícia Intro"/>
                            </a>
                            <div>
                                <h2>${data.items[i].titulo}</h2>
                                <p>${data.items[i].introducao}</p>
                                
                                <div class="info">
                                    <p class="editorias">#${editoriasFormatadas}</p>
                                    <p class="tempoPublicacao">${tempoDecorrido}</p>
                                </div>
                                      <button class="leiaMais" onclick="window.open('${data.items[i].link}', '_blank')">Leia Mais</button>
                            </div>
                        </li>
                    </ul>
                </div>
                `;
            }
        }

        main.innerHTML = html;

        // Chama a função para criar os botões de paginação
        await criarBotoesPaginacao();
    } else {
        semBusca();
    }

   
}
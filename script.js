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

/*
async function getBuscaData(termoBusca) {
    try {
        const apiUrlSearch = `https://servicodados.ibge.gov.br/api/v3/noticias/?busca=${termoBusca}`;
        const response = await fetch(apiUrlSearch);
        const jsonDataSearch = await response.json();

        if (jsonDataSearch.items && jsonDataSearch.items.length > 0) {
            // Se houver resultados, atualiza o conteúdo principal
            updateMainContent(jsonDataSearch);
        } else {
            // Se não houver resultados, exibe uma mensagem de alerta
            semBusca()
        }
    } catch (error) {
        console.error("Ocorreu um erro ao buscar:", error);
    }
};
*/
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


/*
function updateMainContent(data) {
    let html = '';
//<img src="${data.items[i].imagens}" alt="Imagem da Notícia"/>

    const imagensStringificadas = []

    for (let i = 0; i < 10; i++) {

        const imagemObjeto = JSON.parse(data.items[i].imagens);

        const caminhoDaImagem = imagemObjeto.image_intro || imagemObjeto.image_fulltext;

        html += `
        <div class="div">
            <ul>
                <li>
                    <img src="${caminhoDaImagem}" alt="Imagem da Notícia"/>
                    <h2>${data.items[i].titulo}</h2>
                    <p>${data.items[i].introducao}</p>
                    <a href="${data.items[i].link}" target="_blank">${data.items[i].link}</a>
                </li>
            </ul>
        </div>
        `;

    }
    main.innerHTML = html;
}*/
function formatarTempoDecorrido(dataPublicacao) {
    const dataAtual = new Date();
    const dataPublicacaoObj = new Date(dataPublicacao);

    const diff = Math.abs(dataPublicacaoObj - dataAtual );
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






async function getTotalNoticiasRequisitadas() {
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

        let totalNoticiasRequisitadas = 0; // Inicializa a variável com zero

        if (jsonDataSearch.items && jsonDataSearch.items.length > 0) {
            totalNoticiasRequisitadas = jsonDataSearch.items.length; // Atribui o valor retornado à variável
          
        } else {
            console.log("Nenhuma notícia encontrada com os critérios de busca.");
        }

        return totalNoticiasRequisitadas; // Retorna a variável com o total de notícias requisitadas
    } catch (error) {
        console.error("Ocorreu um erro ao obter o total de notícias requisitadas:", error);
        return 0; // Retorna zero em caso de erro
    }
}


async function getTotalNoticiasFiltradas() {
    try {
        // URL da API para buscar todas as notícias
        const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias";

        // Faz a requisição à API para obter o total de notícias disponíveis
        const responseTotal = await fetch(apiUrl);
        const jsonDataTotal = await responseTotal.json();
        const totalNoticias = jsonDataTotal.items ? jsonDataTotal.items.length : 0;

        // Obtém os valores dos filtros
        const selectBoxTipo = document.getElementById("button-tipo");
        const selectedValueTipo = selectBoxTipo.options[selectBoxTipo.selectedIndex].value;
        const deValue = document.getElementById("button-de").value;
        const ateValue = document.getElementById("button-ate").value;

        // Verifica se há filtros aplicados
        if (selectedValueTipo !== "Selecione" || (deValue || ateValue)) {
            // Obtém o termo de busca da URL, se houver
            const queryString = window.location.search;
            const searchTerm = decodeURIComponent(queryString.slice(1));

            // Atualiza a URL da API com os valores selecionados e o termo de busca, se houver
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
            if (searchTerm) {
                searchParams.append('busca', searchTerm);
            }

            // URL da API para buscar notícias com os filtros aplicados
            const apiUrlFiltered = `https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`;

            // Faz a requisição à API para obter as notícias filtradas
            const responseFiltered = await fetch(apiUrlFiltered);
            const jsonDataFiltered = await responseFiltered.json();
            const noticiasFiltradas = jsonDataFiltered.items ? jsonDataFiltered.items.length : 0;

            console.log(`Total de notícias que se encaixam nos filtros: ${noticiasFiltradas}`);
            // Retorna o total de notícias filtradas
            return noticiasFiltradas;
           
        } else {
            // Se não houver filtros aplicados, mostra o total de notícias disponíveis
          
            return totalNoticias;
        }
    } catch (error) {
        console.error("Ocorreu um erro ao obter o total de notícias filtradas:", error);
        return 0; // Retorna zero em caso de erro
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

        console.log(`Total de notícias: ${totalNoticias}`);
        console.log(`Notícias por página: ${noticiasPorPagina}`);

        // Calcula o total de páginas
        const totalPaginas = Math.ceil(totalNoticias / noticiasPorPagina);

        console.log(`Total de páginas: ${totalPaginas}`);

        // Determina a página atual com base na URL
        const urlParams = new URLSearchParams(window.location.search);
        const paginaAtual = parseInt(urlParams.get('pagina')) || 1;

        // Determina o intervalo de páginas a serem exibidas
        let inicio = paginaAtual - 4; // Exibe até 4 páginas antes da página atual
        let fim = paginaAtual + 5; // Exibe até 5 páginas após a página atual

        // Verifica se o início está fora dos limites
        if (inicio < 1) {
            inicio = 1;
            fim = Math.min(totalPaginas, 10); // Exibe até 10 páginas no máximo
        }

        // Verifica se o fim está fora dos limites
        if (fim > totalPaginas) {
            fim = totalPaginas;
            inicio = Math.max(1, totalPaginas - 9); // Exibe até 10 páginas no máximo
        }

        // Remove os botões de paginação existentes, se houver
        const divBotoesExistente = document.querySelector('.div-buttons');
        if (divBotoesExistente) {
            divBotoesExistente.remove();
        }

        // Cria os botões de paginação
        const divBotoes = document.createElement('div');
        divBotoes.classList.add('div-buttons');

        const ulBotoes = document.createElement('ul');
        ulBotoes.classList.add('pagination');

        for (let i = inicio; i <= fim; i++) {
            const liBotao = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = i;

            // Adiciona uma classe especial para indicar a página atual visualmente
            if (i === paginaAtual) {
                liBotao.classList.add('pagina-atual');
                button.style.backgroundColor = '#4682b4'; 
                button.style.color = 'white';// Cor da página atual
            }

            // Adiciona um evento de clique para identificar a página clicada
           // Adiciona um evento de clique para identificar a página clicada
// Adiciona um evento de clique para identificar a página clicada
button.addEventListener('click', function() {
    // Salva a posição atual da janela
    const scrollY = window.scrollY;

    // Atualiza a URL para refletir a página clicada
    const newUrl = `${window.location.pathname}?pagina=${i}`;
    window.history.pushState({}, '', newUrl);
 removerBotoesPaginacao()
    // Recarrega apenas os botões de paginação
    criarBotoesPaginacao().then(() => {
        // Restaura a posição da janela após a recarga dos botões
        window.scrollTo(0, scrollY);
     
    });
});


            liBotao.appendChild(button);
            ulBotoes.appendChild(liBotao);
        }

        divBotoes.appendChild(ulBotoes);
        document.body.appendChild(divBotoes);

        // Retornar os valores para que possam ser acessados externamente
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
                    <ul class ="ul-noticia">
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
                                <button class="leiaMais">Leia Mais</button> <!-- Alterado de <a> para <button> -->
                            </div>
                        </li>
                    </ul>
                </div>
                `;
            }
        }

        // Adiciona os botões de paginação
        html += `
        <div class="div-buttons">
            <ul class="pagination">
        `;
        
        // Chama a função para criar os botões de paginação
        const { totalNoticias, noticiasPorPagina } = await criarBotoesPaginacao();

        html += `
            </ul>
        </div>
        `;
   
    } else {
        semBusca();
    }
//   html += `
 //       <footer>
 //           &copy; Prova segundo bimestre - Programação WEB
 //       </footer>
  //  `;
    main.innerHTML = html;

    // Adicionando eventos de clique aos botões "Leia Mais"
    const botoesLeiaMais = document.querySelectorAll('.leiaMais'); // Corrigido para selecionar botões
    botoesLeiaMais.forEach(botao => {
        botao.addEventListener('click', () => {
            // Obtém o link da notícia
            const linkNoticia = botao.parentElement.querySelector('a').href; // Corrigido para obter o link da notícia corretamente
            // Redireciona para o link da notícia
            window.open(linkNoticia, '_blank');
        });
    });
}

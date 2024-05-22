
function beginData(nome, senha){
    localStorage.setItem("usuario", nome);
    localStorage.setItem("senha", senha);
}
var nome = '';
var nomedigitado = '';
var senhadigitada = '';
var senhaSalva = '';
var nameSalvo = '';

function dados(){
    var nome = document.getElementById('nomeinicio').value;
    var senha = document.getElementById('senhainicio').value;
    beginData(nome, senha);
    alert('Seus dados foram cadastrados!');  
    location.href = 'index.html';
}

function verificar(){
    nomedigitado = document.getElementById('nome').value;
    senhadigitada = document.getElementById('senha').value;
    senhaSalva = localStorage.getItem("senha");
    nameSalvo = localStorage.getItem("usuario");
    if(nomedigitado.length == 0 || senhadigitada.length == 0){
        alert("Tá vazio! Coloque algo para eu verificar...");
    }else{
        if(senhadigitada == senhaSalva && nomedigitado == nameSalvo){
        alert("Ta certinha a senha... Bom trabalho");    
        location.href = 'index2.html';
        }else{
            alert("Ta tudo errado");
        }
    }
}

function registrar(){
    location.href = 'inicio.html';
}

function novasenha(){
    localStorage.removeItem("senha");
    var novasenha = document.getElementById('novasenha').value.trim();
    localStorage.setItem("senha", novasenha);
    alert('Novo dado salvo! Redirecionando para o login...');
    location.href = 'index.html';
}

var config = {
    exibenaTela:function(categoria,listaFilmes){
        var filmes = "";
        listaFilmes.map(item => {
            console.log(item);
            var container = `
                <div class="rounded-xl w-[250px] h-[200px] mx-2 my-2 bg-white flex flex-col justify-center items-center" onclick="informacao(${item.id})" filme="${item.title}">
                    <img src='https://image.tmdb.org/t/p/original/${item.backdrop_path}' loading="lazy" class="w-[300px] h-[150px] rounded-xl"/>
                        <h1>${item.title}</h1>
                        <p>${new Date(item.release_date).getMonth()} / ${new Date(item.release_date).getFullYear()}</p>
                </div>
            `
            filmes += container;
    
            
        });
        
    
        var categ = `
            <div class="w-full bg-slate-200 px-5 py-3">
                <div class="w-full font-extrabold text-2xl">${categoria.name}</div>
                <div filmes="" class="flex flex-wrap ">${filmes} 
                </div>    
            </div>`;
       
    
        document.getElementById('dentro').insertAdjacentHTML("beforeend", categ);
    
        },

    buscargeneros: function(){
        fetch(`https:api.themoviedb.org/3/genre/movie/list?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb`)
        .then(function (dados){
            return dados.json();
        })
        .then(function(dados){
            dados.genres.map((item) => {
                item["filmes"] = [];
                config[item.name] = item;

                fetch(`https://api.themoviedb.org/3/genre/${item.id}/movies?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb`)
                    .then(function(dados){
                        return dados.json();
                    })
                    .then(function(filme){
                        config.exibenaTela(item, filme.results);
                    })
            })
        });

    },
}

function carregar(){
    nome = localStorage.getItem("usuario");
    document.getElementById('mensagem').innerHTML = `<h2>Bem vindo, ${nome} </h2>`;
    if(senhadigitada == senhaSalva && nomedigitado == nameSalvo){    
        config.buscargeneros();
    } else{
        alert('Você não se cadastrou!');
        localStorage.clear();
        location.href = 'index.html';
    }
}

function procura(ev){
    var valor = ev.target.value
    if(valor == ""){
        document.getElementById('dentro').innerHTML = "";
        config.buscargeneros();
    } else{
        if (ev.key == "Enter"){
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${valor}`)
            .then(item => item.json())
            .then(item => {
                document.getElementById('dentro').innerHTML = "";
                tela(item.results);
            })
        }
    }
}

function tela(filmes){
            var listafilmes = "";
            filmes.map(item => {
                var container = `
                    <div class="rounded-xl w-[250px] h-[200px] mx-2 my-2 bg-white flex flex-col justify-center items-center" onclick="informacao(${item.id})" filme="${item.title}">
                        <img src='https://image.tmdb.org/t/p/original/${item.backdrop_path}' loading="lazy" class="w-[300px] h-[150px] rounded-xl"/>
                            <h1>${item.title}</h1>
                            <p>${new Date(item.release_date).getMonth()} / ${new Date(item.release_date).getFullYear()}</p>
                    </div>
                `
                listafilmes += container;
            })

            var geral = `
                <div class="w-full bg-slate-200 px-5 py-3" >
                    <div id="filmes" class="grid grid-cols-5">
                        ${listafilmes}
                    </div>
                </div>
            `

            document.getElementById('dentro').insertAdjacentHTML("beforeend", geral);

}

function informacao(filme){
    fetch(`https://api.themoviedb.org/3/movie/${filme}?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb`)
        .then( resultado => resultado.json())
        .then( dadosfilme => {
            console.log(dadosfilme);
            var modal = `<div class='w-full'>
            <div class="align-right block"> <input type="button" value="X" class="bg-red-300 rounded-xl p-2 w-[50px] h-[50px]" onclick="voltar(event)"> </div>
            <div class='font-2xl font-bold text-slate-600'>${dadosfilme.title}</div>
            <div id='content' class='w-full flex'>
                <div id="coluna1">
                    <p>
                        <b>Pontuação</b>
                        ${dadosfilme.vote_average}
                    </p>
                    <p>
                        <img src='https://image.tmdb.org/t/p/original/${dadosfilme.backdrop_path}'/>
                    </p>
                </div>
                <div id="coluna2">
                    <p>
                        <b>Pontuação</b>
                        ${dadosfilme.homepage}
                    </p>    
                </div>
            </div>
        </div>`
        document.getElementById('dentro').innerHTML = "";
        document.getElementById('dentro').insertAdjacentHTML("beforeend", modal);
        })

}

function voltar(ev){
    ev.parentNode.parentNode.style.display = "none";
    buscargeneros();
}

/*<div class="rounded-xl w-[250px] h-[200px] mx-2 my-2 bg-white flex flex-col justify-center items-center" onclick="informacao(this)" filme="${item.title}">
                    <img src='https://image.tmdb.org/t/p/original/${item.backdrop_path}' loading="lazy" class="w-[300px] h-[150px] rounded-xl"/>
                        <h1>${item.title}</h1>
                        <p>${new Date(item.release_date).getMonth()} / ${new Date(item.release_date).getFullYear()}</p>
                </div>
*/
/* Object.keys(filmes).map((item) => {
    var nome = filmes[item].nome;
    var duracao = filmes[item].duracao;
    document.getElementById('dentro').innerHTML += `<div style=" width: 100%; height: 800px;"><h2 style="display: block; height: 200px;">${item}</h2><div style="display: flex; width: 100%; height: 600px; justify-content: center; align-items: center; flex-wrap: nowrap;"><div><p>${nome}</p> <br><p>${duracao}</p></div></div></div>`
}) */
const API_KEY = 'AIzaSyA2eEhMrItpWYVgmDjMLxZJEV7paDjL1HA';
const myList = [];

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const searchQuery = document.querySelector('input[name="search"]').value;
    if (searchQuery) {
        fetchBooks(searchQuery);
    } else {
        alert('Por favor, insira um termo de pesquisa.');
    }
});

function fetchBooks(searchTerm) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.items) {
                mostrarLivros(data.items);
            } else {
                console.log('Nenhum livro encontrado.');
            }
        })
        .catch(error => console.error('Erro na requisição:', error));
}

function mostrarLivros(livros) {
    const resultadoContainer = document.getElementById('results');
    resultadoContainer.innerHTML = ''; 

    livros.forEach(livro => {
        const { title, authors, imageLinks } = livro.volumeInfo;

        const livroCard = document.createElement('div');
        livroCard.classList.add('nome-img');

        const livroImagem = document.createElement('img');
        livroImagem.classList.add('img-livro');
        livroImagem.src = imageLinks ? imageLinks.thumbnail : '../assets/imgs/erro-img.png';
        livroImagem.alt = `Capa do livro ${title}`;
        livroCard.appendChild(livroImagem);

        const bttnAdd = document.createElement('button');
        bttnAdd.classList.add('add-button');
        bttnAdd.textContent = '+';
        livroCard.appendChild(bttnAdd);

        const livroTitulo = document.createElement('p');
        livroTitulo.classList.add('nome-livro');
        livroTitulo.textContent = title || 'Título não disponível';
        livroCard.appendChild(livroTitulo);

        const livroAutor = document.createElement('p');
        livroAutor.classList.add('nome-autor');
        livroAutor.textContent = `Autor(es): ${authors ? authors.join(', ') : 'Desconhecido'}`;
        livroCard.appendChild(livroAutor);

        resultadoContainer.appendChild(livroCard);

        
        bttnAdd.addEventListener('click', function() {
            myList.push({ title, authors, imageLinks });
            localStorage.setItem('myList', JSON.stringify(myList));
            console.log(myList);
        });
    });
}

function fetchRecommendations() {
    const recommendedTopics = ['romance', 'fantasia', 'humor', 'história'];
    const promises = recommendedTopics.map(topic => {
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${topic}&key=${API_KEY}`;
        return fetch(url).then(response => response.json());
    });

    Promise.all(promises)
        .then(results => {
            const allBooks = [];
            results.forEach(data => {
                if (data.items) {
                    allBooks.push(...data.items); 
                }
            });
            mostrarLivros(allBooks); 
        })
        .catch(error => console.error('Erro ao buscar recomendações:', error));
}


document.getElementById('recomendations').addEventListener('click', function() {
    fetchRecommendations();
});

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }

});


function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = Number(document.getElementById('inputBookYear').value);
    const generateID = generateId();
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedRead = document.getElementById('incompleteBookshelfList');
    uncompletedRead.innerHTML = '';

    const completedRead = document.getElementById('completeBookshelfList');
    completedRead.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = saveBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedRead.append(bookElement);
        } else {
            completedRead.append(bookElement);
        }
    }

});

function saveBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.judul;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + bookObject.penulis;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + bookObject.tahun;

    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('green');
        unfinishedButton.innerText = 'Belum selesai di Baca';

        unfinishedButton.addEventListener('click', function() {
            removeFromFinish(bookObject.id);
        });
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus Buku';

        deleteButton.addEventListener('click', function() {
            removeBook(bookObject.id);
        });
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(unfinishedButton, deleteButton);
        bookContainer.append(buttonContainer);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('green');
        finishedButton.innerText = 'Selesai dibaca';

        finishedButton.addEventListener('click', function() {
            removeFromUnfinish(bookObject.id);
        });
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus Buku';

        deleteButton.addEventListener('click', function() {
            removeBook(bookObject.id);
        });
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(finishedButton, deleteButton);
        bookContainer.append(buttonContainer);
    }
    return bookContainer;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {

            return index;
        }
    }
    return -1;
}

function namaBuku(bookId) {
    for (const i in books) {
        if (books[i].id === bookId) {
            return books[i].judul;
        }
    }
}

function removeBook(bookId) {
    alert('Buku ' + namaBuku(bookId) + ' Telah dihapus');
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}



function removeFromFinish(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeFromUnfinish(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Tidak Mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
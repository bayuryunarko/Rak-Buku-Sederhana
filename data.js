// Berfungsi untuk menyediakan key yang digunakan untuk mengakses data pada local storage
const STORAGE_KEY = "BOOKSHELF_APPS";

// Sebuah global variable yang digunakan untuk menyimpan data temporary BOOK
let books = [];

// Fungsi yang digunakan untuk mengecek dukungan web storage pada browser. Mengembalikan nilai false apabila tidak didukung.
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

// Fungsi yang digunakan untuk menyimpan data BOOK ke storage. Ia mengkonversikan data pada global variabel BOOK ke JSON-formatted string untuk disimpan. Setelah itu, fungsi ini mentrigger custom event ‘ondatasaved’
function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}


// Memuat data BOOK dari web storage ke dalam variabel books. Kemudian trigger custom event ‘ondataloaded’ agar kita bisa menggunakannya untuk load data pada aplikasi.
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

// Fungsi yang digunakan sebagai perantara dalam menyimpan data, ia memastikan terlebih dahulu apakah web storage sudah didukung oleh browser sebelum memanggil saveData()
function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

// Fungsi yang digunakan untuk membuat objek BOOK baru dari beberapa parameter yang telah ditentukan.
function composeBookObject(Title, Author, Year, isComplete) {
    return {
        id: +new Date(),
        Title,
        Author,
        Year,
        isComplete
    };
}

// Mencari objek task BOOK yang ada pada array books berdasarkan ID yang di input pada argumen pertama. Lalu mengembalikan objek BOOK jika ditemukan, dan null sebaliknya.
function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

// Mencari index dari objek task BOOK yang ada pada array books berdasarkan ID yang di input pada argumen pertama. Lalu mengembalikan nilai index (posisi) jika ditemukan, dan - 1 sebaliknya. 
function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

// Fungsi ini digunakan untuk me-render data BOOK yang ada pada object array books.
function refreshDataFromBooks() {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    const completedBookList = document.getElementById("completeBookshelfList");


    for (book of books) {
        const newBook = makeBookShelf(book.Title, book.Author, book.Year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isComplete) {
            completedBookList.append(newBook);
        } else {
            uncompletedBookList.append(newBook);
        }
    }
}
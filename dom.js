// Berfungsi untuk menyediakan key yang akan sering dibutuhkan
const UNCOMPLETED_BOOK = "incompleteBookshelfList";
const COMPLETED_BOOK = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

// Fungsi ini berfungsi untuk mengosongkan form setelah data sebelumnya disubmit
function eraserText() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
}

// Fungsi yang digunakan untuk menambahkan buku baik dalam tampilan maupun local storage
function addBook() {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    const completedBookList = document.getElementById("completeBookshelfList");

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;


    const book = makeBookShelf(bookTitle, bookAuthor, bookYear, isComplete);

    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        completedBookList.append(book);
        updateDataToStorage();
        return completedBookList;
    } else {
        uncompletedBookList.append(book);
        updateDataToStorage();
        return uncompletedBookList;
    }
}

// Fungsi yang digunakan untuk menampilkan book yang sudah dimasukkan pada rak yang tersedia
function makeBookShelf(Title, Author, Year, isComplete) {
    const article = document.createElement("article");
    article.classList.add("book_item");

    const textTitle = document.createElement("h3");
    textTitle.innerText = Title;

    const textAuthor = document.createElement("p");
    const textSpan1 = document.createElement("span")
    textSpan1.innerText = Author;
    textAuthor.innerText = "Penulis : ";
    textAuthor.append(textSpan1);

    const textYear = document.createElement("p");
    textYear.classList.add("year")
    const textSpan2 = document.createElement("span")
    textSpan2.innerText = Year;
    textYear.innerText = "Tahun : ";
    textYear.append(textSpan2);

    const action = document.createElement("div");
    action.classList.add("action");


    if (isComplete) {
        action.append(btnBelumSelesai("green"), btnHapus("red"));
        article.append(textTitle, textAuthor, textYear, action);
        return article;

    } else {
        action.append(btnSelesai("green"), btnHapus("red"));
        article.append(textTitle, textAuthor, textYear, action);
        return article;
    }
}

// Fungsi yang digunakan untuk membuat button yang berfungsi untuk menghapus buku dalam rak
function btnHapus(buttonTypeClass) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = "Hapus buku";
    button.addEventListener("click", function (event) {
        const bookPosition = findBookIndex(event.target.parentElement.parentElement[BOOK_ITEMID]);
        books.splice(bookPosition, 1);
        event.target.parentElement.parentElement.remove();
        updateDataToStorage();
    });
    return button;
}

// Fungsi yang digunakan untuk membuat button yang berfungsi untuk memindahkan buku ke dalam rak yang belum selesai
function btnBelumSelesai(buttonTypeClass) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = "Belum selesai dibaca";
    button.addEventListener("click", function (event) {
        menjadiBelum(event.target.parentElement.parentElement);
    });
    return button;
}

// Fungsi yang digunakan untuk membuat button yang berfungsi untuk memindahkan buku ke dalam rak yang selesai
function btnSelesai(buttonTypeClass) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = "Selesai dibaca";
    button.addEventListener("click", function (event) {
        menjadiSudah(event.target.parentElement.parentElement);
    });
    return button;
}

// Fungsi yang digunakan untuk memberikan event buku dipindah ke dalam rak yang telah selesai dibaca saat button selesai di click
function menjadiSudah(taskElement /* HTMLELement */) {
    const listCompleted = document.getElementById(COMPLETED_BOOK);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p > span").innerText;
    const taskYear = taskElement.querySelector(".book_item > .year > span").innerText;

    const newBook = makeBookShelf(taskTitle, taskAuthor, taskYear, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

// Fungsi yang digunakan untuk memberikan event buku dipindah ke dalam rak yang belum selesai dibaca saat button belum selesai di click
function menjadiBelum(taskElement /* HTMLELement */) {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p > span").innerHTML;
    const taskYear = taskElement.querySelector(".book_item > .year > span").innerText;

    const newBook = makeBookShelf(taskTitle, taskAuthor, taskYear, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;


    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}
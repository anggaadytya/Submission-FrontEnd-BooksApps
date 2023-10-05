const books = [];

console.log(books);

const isStorageExist = () => {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

function loadDataFromStorage() {
  const data = JSON.parse(localStorage.getItem("BOOKSHELF_APPS"));
  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }
  document.dispatchEvent(new Event("render-book"));
}

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById("tambahBuku");
  simpanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBooks();
  });

  const searchForm = document.getElementById("formCari");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem("BOOKSHELF_APPS", parsed);
    document.dispatchEvent(new Event("saved-book"));
  }
}

function moveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem("BOOKSHELF_APPS", parsed);
    document.dispatchEvent(new Event("moved-book"));
  }
}

function deleteData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem("BOOKSHELF_APPS", parsed);
    document.dispatchEvent(new Event("deleted-book"));
  }
}

function addBooks() {
  const title = document.getElementById("judul").value;
  const author = document.getElementById("penulis").value;
  const year = parseInt(document.getElementById("tahun").value, 10);
  const isRead = document.getElementById("isRead");

  let bookStatus;

  if (isRead.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: title,
    author: author,
    year: year,
    isComplete: bookStatus,
  });

  document.dispatchEvent(new Event("render-book"));
  saveData();
}

document.addEventListener("render-book", () => {
  const unfinishedBook = document.getElementById("unCompleted");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("isCompleted");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

document.addEventListener("saved-book", () => {
  alert("Berhasil Disimpan!");
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Disimpan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 3000);
});

document.addEventListener("moved-book", () => {
  alert("Berhasil Dipindahkan!");
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dipindahkan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 3000);
});

document.addEventListener("deleted-book", () => {
  alert("Berhasil Dihapus!");
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dihapus!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 3000);
});

function makeBook(objectBook) {
  const textTitle = document.createElement("h1");
  textTitle.classList.add("itemTitle");
  textTitle.innerHTML = objectBook.title;

  const textYear = document.createElement("p");
  textYear.classList.add("itemYear");
  textYear.innerText = objectBook.year;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("itemAuthor");
  textAuthor.innerText = objectBook.author;

  const textContainer = document.createElement("div");
  textContainer.classList.add("itemText");
  textContainer.append(textTitle, textYear, textAuthor);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("itemAction");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${objectBook.id}`);

  const toolTipUndo = document.createElement("span");
  toolTipUndo.classList.add("toolTipText");
  toolTipUndo.innerText = "Undo Button";

  const toolTipEdit = document.createElement("span");
  toolTipEdit.classList.add("toolTipText");
  toolTipEdit.innerText = "Edit Button";

  const toolTipTrash = document.createElement("span");
  toolTipTrash.classList.add("toolTipText");
  toolTipTrash.innerText = "Delete Button";

  const toolTipCheck = document.createElement("span");
  toolTipCheck.classList.add("toolTipText");
  toolTipCheck.innerText = "Check Button";

  if (objectBook.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undoButton", "toolTip");
    undoButton.innerHTML = `<i class='bx bx-undo'></i>`;
    undoButton.appendChild(toolTipUndo);

    undoButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton", "toolTip");
    editButton.innerHTML = `<i class='bx bx-edit-alt'></i>`;
    editButton.appendChild(toolTipEdit);

    editButton.addEventListener("click", function () {
      editBook(objectBook.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton", "toolTip");
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;
    trashButton.appendChild(toolTipTrash);

    trashButton.addEventListener("click", function () {
      deleteBook(objectBook.id);
    });

    actionContainer.append(undoButton, editButton, trashButton);
    container.append(actionContainer);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("checkButton", "toolTip");
    checkButton.innerHTML = `<i class='bx bx-check'></i>`;
    checkButton.appendChild(toolTipCheck);

    checkButton.addEventListener("click", function () {
      addBookToCompleted(objectBook.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton", "toolTip");
    editButton.innerHTML = `<i class='bx bx-edit-alt'></i>`;
    editButton.appendChild(toolTipEdit);

    editButton.addEventListener("click", function () {
      editBook(objectBook.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton", "toolTip");
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;
    trashButton.appendChild(toolTipTrash);

    trashButton.addEventListener("click", function () {
      deleteBook(objectBook.id);
    });

    actionContainer.append(checkButton, editButton, trashButton);
    container.append(actionContainer);
  }
  return container;
}

const addBookToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event("render-book"));
  moveData();
};

const removeBookFromCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event("render-book"));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event("render-book"));
  deleteData();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

function searchBook() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".itemTitle");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const modal = document.getElementById("editModal");
  const span = document.getElementsByClassName("close")[0];
  const newTitle = document.getElementById("newTitle");
  const newAuthor = document.getElementById("newAuthor");
  const newYear = document.getElementById("newYear");
  const newRead = document.getElementById("newRead");

  newTitle.value = bookTarget.title;
  newAuthor.value = bookTarget.author;
  newYear.value = bookTarget.year;
  newRead.checked = bookTarget.isComplete;

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const saveButton = document.getElementById("saveEdit");
  saveButton.addEventListener("click", function () {
    const title = newTitle.value;
    const author = newAuthor.value;
    const year = newYear.value;
    const isRead = newRead.checked;

    if (title !== "" && author !== "" && year !== "") {
      bookTarget.title = title;
      bookTarget.author = author;
      bookTarget.year = year;
      bookTarget.isComplete = isRead;

      saveData();
      document.dispatchEvent(new Event("saved-book"));
      modal.style.display = "none";
    }
  });
}

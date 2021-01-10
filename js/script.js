/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/
// project constraints
const pageSize = 9;
// dom elements
const studentList = document.querySelector(".student-list");
const page = document.querySelector(".page");
const header = document.querySelector(".header");
const pagination = document.querySelector(".pagination");

/**
 * Creates html element with defined property
 *
 * @param {string} elementName
 * @param {string} property
 * @param {string} value
 * @returns Element
 */
function createElement(elementName, property, value) {
    const element = document.createElement(elementName);
    if (property && value) {
        element[property] = value;
    }
    return element;
}

/**
 * Check input string contains valid characters
 *
 * @param {string} searchString
 * @return {boolean}
 */
function validateInput(searchString) {
    if (/[^a-zA-Z0-9]/.test(searchString)) {
        console.log('Invalid characters detected in search field.');
        return false;
    }
    return true;
}

/**
 * Filters by first and lastname
 *
 * @param students
 * @param query
 */
function filterItems(students, query) {
    if (query) {
        return students.filter(el =>
            el.name.first.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            el.name.last.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    }
    return null;
}

function createSearchBlock() {
    const searchLabel = createElement("label", "className", "student-search");
    searchLabel.for = "search";
    const searchInput = createElement("input", "id", "search");
    searchInput.placeHolder = "Search by name...";
    searchLabel.appendChild(searchInput);
    const searchButton = createElement("button", "type", "button");
    const buttonImage = createElement("img", "src", "img/icn-search.svg");
    buttonImage.alt = "Search icon";
    searchButton.appendChild(buttonImage);
    searchLabel.appendChild(searchButton);
    return searchLabel;
}
// Create and insert search block
header.insertAdjacentHTML("beforeend", createSearchBlock().outerHTML);

/**
 *  Creates students list at home page
 *
 * @param {array} list
 * @param {number} page
 */
function showPage(list, page) {
    const startIndex = (page * pageSize) - pageSize;
    const endIndex = page * pageSize;
    const noResult = document.querySelector(".no-results");
    if(noResult) {
        noResult.remove();
    }

    studentList.innerHTML = '';

    /**
     * Creates student card with student information
     *
     * @returns list element with student details
     * @param student
     */
    function createStudentListItem(student) {
        const listItem = createElement("li", "className", "student-item cf");
        const divStudentDetails = createElement("div", "className", "student-details");
        const imgAvatar = createElement("img", "className", "avatar");
        imgAvatar.src = student.picture.large;
        imgAvatar.alt = `${student.name.title + " " + student.name.first + " " + student.name.last}`;
        divStudentDetails.appendChild(imgAvatar);
        const h3StudentName = createElement("h3", "textContent", `${student.name.first + " " + student.name.last}`);
        divStudentDetails.appendChild(h3StudentName);
        const spanStudentEmail = createElement("span", "className", "email");
        spanStudentEmail.innerHTML = student.email;
        divStudentDetails.appendChild(spanStudentEmail);

        listItem.appendChild(divStudentDetails);

        const divJoinDetails = createElement("div", "className", "joined-details");
        const spanRegisterDate = createElement("span", "className", "date");
        spanRegisterDate.innerHTML = `Joined ${student.registered.date}`;
        divJoinDetails.appendChild(spanRegisterDate);

        listItem.appendChild(divJoinDetails);

        return listItem;
    }

    for (let i = 0; i < list.length; i++) {
        if (i >= startIndex && i < endIndex) {
            const student = list[i];
            const listItem = createStudentListItem(student);
            studentList.insertAdjacentHTML("beforeend", listItem.outerHTML);
        }
    }
}

/**
 * Creates page links at home page if list is not empty
 *
 * @param {array} list
 */
function addPagination(list) {
    if (list.length) {
        pagination.style.display = "block";
        const numberOfPage = Math.floor((list.length + pageSize - 1) / pageSize);
        const pageLinks = document.querySelector(".link-list");
        pageLinks.innerHTML = "";

        /**
         * Creates links for pages
         *
         * @param pageNumber
         */
        function createPageLink(pageNumber) {
            const li = createElement("li");
            const button = createElement("button", "type", "button");

            button.textContent = pageNumber;
            li.appendChild(button);
            return li;
        }

        for (let i = 1; i <= numberOfPage; i++) {
            // Create page link for every page
            const pageLi = createPageLink(i);
            pageLinks.insertAdjacentHTML("beforeend", pageLi.outerHTML);
        }

        pageLinks.firstElementChild.firstElementChild.className = "active";
        // Event handler for page change request
        pageLinks.addEventListener("click", (e) => {
            if (e.target.tagName === 'BUTTON') {
                // changes active page to clicked page
                pageLinks.querySelector(".active").className = "";
                e.target.className = "active";

                showPage(list, e.target.textContent);
            }
        });
    } else {
        pagination.style.display = "none";
    }
}

// initialize with all data at first visit
showPage(data, 1);
addPagination(data);

// filter data with query from search form
const filterInput = document.getElementById("search");
filterInput.addEventListener("input", updateStudents);
let students = [];

function updateStudents(e) {
    if (e.target.value && validateInput(e.target.value)) {
        const list = filterItems(data, e.target.value);
        students = [...list];
        if (students.length) {
            // displays students found with search query
            showPage(students, 1);
            addPagination(students);
        } else {
            // displays no results message when no students found
            showPage(students, 1);
            addPagination(students);
            const noResult = createElement("p", "className", "no-results");
            noResult.textContent = "No result";
            page.insertBefore(noResult, pagination);

        }
    } else {
        // when search form cleared display all students
        showPage(data, 1);
        addPagination(data);
    }
}


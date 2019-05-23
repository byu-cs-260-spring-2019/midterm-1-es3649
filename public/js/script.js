const LIBRARY_API = "http://openlibrary.org/search.json?q="

function replaceSpace(str) {
    return str.replace(' ', '+');
}

var vue = new Vue ({

    el: "#root",
    data: {
        loading: true,
        loadingMessage: "Enter a book name to search for it",
        bookName: '',
        bookList: [],
        masterList: [],
    },
    computed: {
        favorites() {
            return this.masterList.filter(book => {return book.favorite});
        }
    },
    methods: {
        async searchBooks() {
            this.bookList = [];
            if (this.bookName == '') {
                return;
            }
            try {
                this.loadingMessage = "Loading..."
                this.loading = true;
                
                const lookup = await axios.get(LIBRARY_API + replaceSpace(this.bookName));
                console.log(lookup);
                
                if (lookup.data.docs.length == 0) {
                    // do a not found
                }
                
                this.loading = false;
                for (var i = 0; i < lookup.data.docs.length; i++) {
                    
                    try {
                        // if (! lookup.data.docs[i].hasOwnProperty('isbn')) {
                        //     continue;
                        // }
                        const ISBN = lookup.data.docs[i].isbn[0];
                        const rawBookData = await axios.get("https://openlibrary.org/api/books?bibkeys=ISBN:" + ISBN + "&jscmd=details&format=json");
                        
                        const keyName = "ISBN:" + ISBN;
                        const bookData = rawBookData.data[keyName].details;
                        console.log(bookData);

                        var thumbnail;
                        if (rawBookData.data[keyName].hasOwnProperty("thumbnail_url")) {
                            thumbnail = rawBookData.data[keyName].thumbnail_url;
                        } else {
                            thumbnail = "oldbook.jpeg";
                        } 

                        var _author;
                        try {
                            _author = bookData.authors[0].name;
                        } catch (error) {
                            _author = "[not provided]";
                        }
                        
                        // TODO make a whole book object out of this output
                        var newBook = {
                            title: bookData.title,
                            publisher: bookData.publishers[0],
                            author: _author,
                            number_of_pages: bookData.number_of_pages,
                            description: bookData.description,
                            isbn_10: ISBN,
                            thumbnail_url: thumbnail,
                            favorite: false
                        }

                        this.bookList.push(newBook);
                        this.masterList.push(newBook);
                        
                    } catch (err) {
                        console.error(err);
                    }
                }
            } catch (err) {
                console.error(err);
            }

            console.log(this.bookList);
            
        }
    }
});
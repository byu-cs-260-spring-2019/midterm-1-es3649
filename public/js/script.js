const LIBRARY_API = "http://openlibrary.org/search.json?q="

function replaceSpace(str) {
    return str.replace(' ', '+');
}

var vue = new Vue ({

    el: "#root",
    data: {
        loading: true,
        bookName: '',
        bookList: [],
        masterList: [],
    },
    computed: {

    },
    methods: {
        async searchBooks() {
            if (this.bookName == '') {
                return;
            }
            try {
                this.loading = true;
                
                const lookup = await axios.get(LIBRARY_API + replaceSpace(this.bookName));
                console.log(lookup);
                
                if (lookup.data.docs.length == 0) {
                    // do a not found
                }
                
                // TODO make a whole book object out of this output
                for (var i = 0; i < lookup.data.docs.length; i++) {

                    try {

                        const ISBN = lookup.data.docs[1].isbn[0];
                        const rawBookData = await axios.get("https://openlibrary.org/api/books?bibkeys=ISBN:" + ISBN + "&jscmd=details&format=json");

                        const keyName = "ISBN:" + ISBN;
                        const bookData = rawBookData.data[keyName];
                        console.log(bookData);

                        var newBook = {
                            // name:
                            // publisher:
                            // author:
                            // isbn:
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
            this.loading = false;
        }
    }
});
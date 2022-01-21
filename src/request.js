export default class NewApiServer {
    constructor() {
        this.page = 1;
        this.searchQuery = '';
        this.perPage = 39;
        this.totalImages = 0;
    }
    async fetchPics() {
        const pixabayKey = '25251532-72426a9e0e55162032e249781';
        const searchParams = new URLSearchParams({
            key: pixabayKey,
            q: this.searchQuery,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: this.page,
            per_page: this.perPage,
        })
        const aPic = await fetch(`https://pixabay.com/api/?${searchParams}`)
        if (!aPic.ok) {
            throw new Error(aPic.status);
        }
        this.incrementPage();
        let images = await aPic.json();   //розкодує відповідь сервера
        this.totalImages = images.totalHits; //берем totalHits з відповіді сервера і зберігаємо в екземпляр класа
        return images;
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}


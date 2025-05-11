const API_KEY: string = 'RtxTNGwYhVzZc8e6vQqXgdU0BAoM5mNEnxtJcMs2';
const BASE_URL: string = 'https://images-api.nasa.gov/';

interface SpaceItem {
    links?: { href: string }[];
    data: { title: string; description: string }[];
}

interface NasaResponse {
    collection: {
        items: SpaceItem[];
    };
}

const searchTextElement: HTMLInputElement = document.getElementById('searchText') as HTMLInputElement;
const spaceContainerElement: HTMLElement = document.getElementById('spaceContainer') as HTMLElement;
const errorContainerElement: HTMLElement = document.getElementById('errorContainer') as HTMLElement;
const loadingContainerElement: HTMLElement = document.getElementById('loadingContainer') as HTMLElement;

searchTextElement.addEventListener('input', debounce(onTextInput, 500));

async function onTextInput(event: Event): Promise<void> {
    spaceContainerElement.innerHTML = '';
    errorContainerElement.innerHTML = '';
    loadingContainerElement.style.display = 'block';

    const searchString: string = (event.target as HTMLInputElement).value.trim();

    if (!searchString) {
        errorContainerElement.innerHTML = 'Введіть запит';
        loadingContainerElement.style.display = 'none';
        return;
    }

    try {
        const found: SpaceItem[] = await findSpaceData(searchString);
        spaceContainerElement.innerHTML = found.slice(0, 6).map(item => getHtmlForSpaceItem(item)).join('');
    } catch (error: unknown) {
        errorContainerElement.innerHTML = (error as Error).message;
    } finally {
        loadingContainerElement.style.display = 'none';
    }
}

async function findSpaceData(searchKey: string): Promise<SpaceItem[]> {
    const searchLink: string = `${BASE_URL}search?q=${encodeURIComponent(searchKey)}&api_key=${API_KEY}`;
    const response: Response = await fetch(searchLink);
    const data: NasaResponse = await response.json();

    if (!data.collection.items.length) {
        throw new Error('Брак інформації');
    }

    return data.collection.items;
}

function getHtmlForSpaceItem(spaceData: SpaceItem): string {
    const imgUrl: string = spaceData.links?.[0]?.href || 'images/no-image.png';
    const title: string = spaceData.data[0]?.title || 'Брак назви';
    const description: string = spaceData.data[0]?.description || 'Брак опису';

    return `
        <div class="space-item">
            <img src="${imgUrl}" alt="${title}" loading="lazy">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
}

function debounce(callback: (event: Event) => void, wait: number): (this: HTMLInputElement, ev: Event) => void {
    let timer: number | null = null;
    return function (this: HTMLInputElement, ...args: [Event]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            callback.apply(this, args);
        }, wait);
    };
}
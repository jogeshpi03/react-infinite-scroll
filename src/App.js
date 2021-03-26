import React from 'react'
import './App.css';
import axios from 'axios'

const TOTAL_PAGES = 10;

const Item = ({ children, reference }) => {
    return (
        <div ref={reference}>
            {children}
        </div>
    );
};

const Loader = () => {
    return (
        <div className="w-full md:w-3/5 mx-auto p-4 text-center mb-4">
            <svg class="animate-spin h-8 w-8 mx-auto text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )
}

function App() {

    const [items, setItems]         = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasMore, setHasMore]     = React.useState(true);
    const [pages, setPages]         = React.useState(1);
    const observer                  = React.useRef();

    React.useEffect(() => {
        getItems(pages);
        setPages((pages) => pages + 1);
    }, []);

    const lastItemRef = React.useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
        
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    if (pages < TOTAL_PAGES) {
                        getItems(pages);
                        setPages((pages) => pages + 1);
                    } else {
                        setHasMore(false);
                    }
                }
            });
        
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const getItems = async (page) => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await axios.get(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=5`)
        .then(resp => {
            setItems([...items, ...resp.data])
            setIsLoading(false)
        });
    }

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="flex justify-center p-4 mb-4">
                    <h1 className="text-4xl font-semibold">React Infinite Scroll</h1>
                </div>
                <div className="flex flex-col">
                
                    {items.map((item, index) =>
                        index + 1 === items.length ? (
                        <Item reference={lastItemRef} key={index}>
                            <div className="w-full md:w-3/5 bg-gray-300 mx-auto p-4 rounded mb-4 flex">
                                <img src={item.thumbnailUrl} alt={`Image ${index}`} className="flex-auto mr-4" width="150" height="150" />
                                <div className="flex-auto">
                                    <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                                    <p className="text-sm">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset ...
                                    </p>
                                </div>
                            </div>
                        </Item>
                        ) : (
                        <Item key={index}>
                            <div className="w-full md:w-3/5 bg-gray-300 mx-auto p-4 rounded mb-4 flex">
                                <img src={item.thumbnailUrl} className="flex-auto mr-4" width="150" height="150" />
                                <div className="flex-auto">
                                    <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                                    <p className="text-sm">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset ...
                                    </p>
                                </div>
                            </div>
                        </Item>
                        )
                    )}
                    
                    {isLoading && <Loader />}
                </div>
            </div>
        </>
    );
}

export default App;

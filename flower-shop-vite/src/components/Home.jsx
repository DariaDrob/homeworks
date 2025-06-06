const Home = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: 'url(/images/hello.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1
                style={{
                    fontSize: '48px',
                    fontFamily: "'Lobster', cursive",
                    fontStyle: 'italic',
                    color: '#fff',
                    textAlign: 'center',
                    marginBottom: '24px',
                    textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff69b4, 0 0 40px #ff69b4, 2px 2px 5px rgba(0,0,0,0.5)',
                }}
            >
                Ласкаво просимо до Квіткового гаю!
            </h1>
            <p style={{ fontSize: '20px', color: '#fff', textAlign: 'center' }}>
                Ми пропонуємо найсвіжіші та найкрасивіші квіти для будь-якої нагоди.
            </p>
        </div>
    );
};

export default Home;
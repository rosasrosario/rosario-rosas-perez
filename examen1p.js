const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = 5000;
const app = express();
app.use(cookieParser());

app.use(session({
    user: 'admin',
    secret: '784rf8hes94k5=1ks',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    if (!req.session.visitas) {
        req.session.visitas = {};
    }
    const rutaActual = req.path;
    req.session.visitas[rutaActual] = req.session.visitas[rutaActual] || 0;
    req.session.visitas[rutaActual]++;
    if (req.session.visitas[rutaActual] === 3) {
        const msg = `Parece que te interesa el tema de la ruta ${rutaActual}`;
        res.status(200).send(`<script>alert('${msg}')</script>`);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    const agent = req.headers['user-agent'];
    // Capturamos el agente del usuario y lo guardamos en una cookie llamada "Navegador"
    res.cookie("Navegador", agent, {
        httpOnly: true
    });
    res.send('Visita las páginas que desees');
});

// Ruta con query
app.get('/query', (req, res) => {
    const query_user = req.query;
    // Guardamos cada dato de la query en una cookie diferente
    if (query_user.data1) {
        res.cookie("Data1", query_user.data1, {
            httpOnly: true,
            maxAge: 1000 * 20
        });
    }
    if (query_user.data2) {
        res.cookie("Data2", query_user.data2, {
            httpOnly: true,
            maxAge: 1000 * 20
        });
    }
    if (query_user.data3) {
        res.cookie("Data3", query_user.data3, {
            httpOnly: true,
            maxAge: 1000 * 20
        });
    }
    res.send('Querys recibidas');
});

// Ruta para mostrar historial de visitas
app.get('/historial', (req, res) => {
    const paginas = req.session.visitas;
    res.send(`Páginas consultadas: ${JSON.stringify(paginas)}`);
});

app.listen(port, () => {
    console.log(`Escuchando puerto ${port}`);
});

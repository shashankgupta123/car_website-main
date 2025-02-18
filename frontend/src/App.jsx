import 'regenerator-runtime/runtime';
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from './Routers/AppRouter';

const App = () => {
    return (
        <Router>
            <div>
                <AppRouter/>
            </div>
        </Router>
    );
};

export default App;

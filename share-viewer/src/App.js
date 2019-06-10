import React, { Component } from "react";
import "./App.css";
import ShareTable from "./Components/ShareTable";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <ShareTable />
                </header>
            </div>
        );
    }
}

export default App;

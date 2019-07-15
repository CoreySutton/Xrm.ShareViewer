import * as React from "react";
import ShareTable from "./ShareTable";

class ShareViewer extends React.Component {
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

export default ShareViewer;

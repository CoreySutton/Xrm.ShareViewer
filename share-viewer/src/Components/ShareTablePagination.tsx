import * as React from "react";
import { Component } from "react";
import { Pagination } from "react-bootstrap";

interface ShareTablePaginationProps {
    pageSize: number;
    pageNumber: number;
    recordsCount: number;
    onPageIncrement: () => void;
    onPageDecrement: () => void;
    onPageChange: (pageNumber: number) => void;
}

interface ShareTablePaginationState {}

class ShareTablePagination extends Component<ShareTablePaginationProps, ShareTablePaginationState> {
    render() {
        return (
            <div>
                <Pagination size="sm">{this.createPaginationItems()}</Pagination>
            </div>
        );
    }

    createPaginationItems = () => {
        let numberOfPages = this.props.recordsCount / this.props.pageSize + 1;
        let items = [];
        items.push(<Pagination.Prev onClick={this.props.onPageDecrement} />);
        for (let i = 1; i < numberOfPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === this.props.pageNumber}
                    onClick={() => {
                        this.props.onPageChange(i);
                    }}
                >
                    {i}
                </Pagination.Item>
            );
        }

        items.push(<Pagination.Next onClick={this.props.onPageIncrement} />);
        return items;
    };
}

export default ShareTablePagination;

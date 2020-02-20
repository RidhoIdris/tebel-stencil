import { Component, Prop } from '@stencil/core';
import 'https://unpkg.com/ag-grid-community@19.0.0/dist/ag-grid-community.min.js';
@Component({
    tag: 'aep-table',
    styleUrl: 'aep-table.css',
    shadow: false
})
export class AepTable {
    content: null;
    @Prop() properties;
    renewTypeClassRules = {
        'current-price': 'x=="current-price"',
        'current-term': 'x=="current-term"',
        'monthly': 'x=="monthly"',
        'no-renew': 'x=="no-renew"',
        'renew': 'x=="renew"',
        'revised': 'x=="revised"'
    };
    checkboxRenderer = function (params) {
        return `<label class="container"><input type='checkbox' ${params.value == 'Y' ? 'checked' : ''} /><span class="checkmark"></span></label>`;
    }
    renewTypeRenderer = function (params) {
        return '<i class="icon-' + params.value + '"></i>';
    }
    gridOptions = {
        rowSelection: 'multiple',
        rowData: this.content,
        enableSorting: true,
        enableFilter: true,
        suppressMenuHide: true,
        enableColResize: false,
        paginationPageSize: 10,
        pagination: true,
        domLayout: 'autoHeight',
        headerHeight: 36,
        groupHeaderHeight: 36,


        defaultColDef: {
            // enableColResize: false,
            // editable: false,
            // autoHeight: true,
            // suppressMenu: true,
            filter: true
        },
        //getRowModelClass:function(){return 'rowclass'},
        onGridReady: function () {
            console.log(this.properties);
        },
        columnDefs: [
            { headerName: "Athlete", field: "athlete", width: 150 },
            { headerName: "Age", field: "age", width: 90, filter: 'agNumberColumnFilter' },
            { headerName: "Country", field: "country", width: 120 },
            { headerName: "Year", field: "year", width: 90 },
            {
                headerName: "Date", field: "date", width: 145, filter: 'agDateColumnFilter', filterParams: {
                    comparator: function (filterLocalDateAtMidnight, cellValue) {
                        var dateAsString = cellValue;
                        if (dateAsString == null) return -1;
                        var dateParts = dateAsString.split("/");
                        var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                        if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                            return 0
                        }

                        if (cellDate < filterLocalDateAtMidnight) {
                            return -1;
                        }

                        if (cellDate > filterLocalDateAtMidnight) {
                            return 1;
                        }
                    },
                    browserDatePicker: true
                }
            },
            { headerName: "Sport", field: "sport", width: 110 },
            { headerName: "Gold", field: "gold", width: 100, filter: 'agNumberColumnFilter' },
            { headerName: "Silver", field: "silver", width: 100, filter: 'agNumberColumnFilter' },
            { headerName: "Bronze", field: "bronze", width: 100, filter: 'agNumberColumnFilter' },
            { headerName: "Total", field: "total", width: 100, filter: false }
        ]
    };

    componentWillLoad() {
        return fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json')
            .then(response => response.json())
            .then(data => {
                this.content = data;
            });
    }
    componentDidLoad() {
        //var gridDiv = this.tablediv;
        var gridDiv = document.querySelector('#myGrid');
        new window['agGrid'].Grid(gridDiv, this.gridOptions);
        this.gridOptions['api'].sizeColumnsToFit();
        this.gridOptions['api'].setRowData(this.content);
        // console.log(this.content);
    }
    render() {
        return <div id="myGrid" class="gag-theme-balham"></div>
    }
}

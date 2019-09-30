<Grid
rows={this.state.rows}
columns={this.columns}


// rowUpdated={setRows(generateRows)}
>
<PagingState
    defaultCurrentPage={0}
    defaultPageSize={10}
/>
{/* <RowDetailState
// defaultExpandedRowIds={[2, 5]}
/> */}

<IntegratedPaging />
<DragDropProvider />
<GroupingState />
{/* <GroupingState defaultGrouping={[{ columnName: 'city' }]} /> */}

<IntegratedGrouping />
<SummaryState
// totalItems={totalSummaryItems}
/>
<IntegratedSummary />
{/* <TableSummaryRow /> */}
<Table
    style={{ width: '80%' }} />
<TableHeaderRow />
{/* <TableRowDetail
    contentComponent={RowDetail}
/> */}
<TableGroupRow />
<Toolbar />
<GroupingPanel
    messages={{
        groupByColumn: 'Przeciągnij kolumnę tutaj aby pogrupować'
    }}

/>
<PagingPanel
    pageSizes={this.pageSizes}
    messages={{
        rowsPerPage: 'Wierszy na stronę',
        showAll: 'Wszystkie',

    }}
/>
</Grid>
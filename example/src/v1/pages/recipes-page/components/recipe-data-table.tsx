import * as React from 'react';
import styled from 'styled-components';
import type { IRecipeDataTableProps } from '../types/recipe-data-table-props';

const Table = styled.table`
  width: 100%;
  min-width: 32rem;
  border-collapse: collapse;
  background: #fff;

  caption {
    padding: 0.5rem;
    font-weight: 700;
    text-align: left;
  }

  th,
  td {
    padding: 0.55rem;
    border: 1px solid #cbd5e1;
    text-align: left;
  }

  th {
    background: #e2e8f0;
  }
`;

export const RecipeDataTable: React.FC<IRecipeDataTableProps> = ({
  caption,
  columns,
  rows,
}) => (
  <Table>
    <caption>
      {caption} ({rows.length})
    </caption>
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.field} scope="col">
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {columns.map((column) => (
            <td key={column.field}>{String(row[column.field])}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

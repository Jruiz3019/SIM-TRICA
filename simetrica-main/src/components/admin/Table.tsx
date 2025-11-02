import type { ReactNode } from 'react';
import './Table.css';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function Table<T extends { _id?: string; id?: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos para mostrar',
  onRowClick,
}: TableProps<T>) {
  const getRowId = (row: T, index: number): string => {
    return row._id || row.id || `row-${index}`;
  };

  const getCellValue = (row: T, column: TableColumn<T>): unknown => {
    if (typeof column.key === 'string' && column.key.includes('.')) {
      const keys = column.key.split('.');
      let value: unknown = row;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = (value as Record<string, unknown>)[key];
        } else {
          return undefined;
        }
      }
      return value;
    }
    return (row as Record<string, unknown>)[column.key as string];
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  className="table-header-cell"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                className={`table-row ${onRowClick ? 'table-row--clickable' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => {
                  const cellValue = getCellValue(row, column);
                  return (
                    <td
                      key={`${getRowId(row, rowIndex)}-${String(column.key)}-${colIndex}`}
                      className="table-cell"
                    >
                      {column.render 
                        ? column.render(cellValue, row) 
                        : (cellValue as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

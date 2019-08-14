import React from 'react';
import { Component, ComponentProps } from './Component/index';
import { Group, GroupProps } from './Group/index';

export interface IteratorProps {
  originalData: any;
  filteredData: any;
}

export const Iterator: React.FC<IteratorProps> = ({
  originalData,
  filteredData,
}) => (
  <>
    {filteredData.map((item: any) => {
      if (typeof item.children !== 'undefined') {
        const items: any = [];

        item.children.forEach((id: any) => {
          items.push(originalData.filter((fitem: any) => id === fitem.id)[0]);
        });

        switch (item.type) {
          case 'GROUP': {
            const { id, value, isNegated } = item as GroupProps;

            return (
              <Group key={id} value={value} isNegated={isNegated} id={id}>
                <Iterator originalData={originalData} filteredData={items} />
              </Group>
            );
          }
          default: {
            const { field, value, id, operator } = item as ComponentProps;

            return (
              <div key={item.id}>
                <Component
                  key={id}
                  field={field}
                  value={value}
                  operator={operator}
                  id={id}
                />
                <Iterator originalData={originalData} filteredData={items} />
              </div>
            );
          }
        }
      } else {
        const { field, value, id, operator } = item as ComponentProps;

        return (
          <Component
            key={id}
            field={field}
            value={value}
            operator={operator}
            id={id}
          />
        );
      }
    })}
  </>
);

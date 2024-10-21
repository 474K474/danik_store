import React from 'react';

const FilterSidebar = ({ onSortChange, onSizeChange, onColorChange, onCategoryChange, onTypeChange, resetFilters }) => {
  return (
    <div className="sidebar">
      <h3>Фильтры <p className="filters__submit" onClick={resetFilters}>убрать все</p></h3>

      <fieldset className="fieldset fieldset--radio">
        <legend>Сортировать по</legend>
        <div className="fieldset__input">
          <input
            type="radio"
            name="sort"
            id="sort-desc"
            onChange={() => onSortChange('desc')}
          />
          <label htmlFor="sort-desc">Убыванию цены</label>
        </div>
        <div className="fieldset__input">
          <input
            type="radio"
            name="sort"
            id="sort-asc"
            onChange={() => onSortChange('asc')}
          />
          <label htmlFor="sort-asc">Возрастанию цены</label>
        </div>
        
      </fieldset>

      <fieldset className="fieldset fieldset--select">
        <legend>Размер</legend>
        <div className="fieldset__input sizes">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <button key={size} onClick={() => onSizeChange(size)}>{size}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="fieldset fieldset--checkbox">
        <legend>Цвет</legend>
        <div className="fieldset__input colors">
          {['black', 'white', 'blue', 'yellow', 'red', 'green'].map((color) => (
            <button key={color} className={`color-swatch ${color}`} onClick={() => onColorChange(color)} />
          ))}
        </div>
      </fieldset>

    </div>
  );
};

export default FilterSidebar;

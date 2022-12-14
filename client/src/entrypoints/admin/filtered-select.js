/* A select box component that can be dynamically filtered by the option chosen in another select box.

  <div>
    <label for="id_continent">Continent</label>
    <select id="id_continent">
      <option value="">--------</option>
      <option value="1">Europe</option>
      <option value="2">Africa</option>
      <option value="3">Asia</option>
    </select>
  </div>
  <div>
    <label for="id_country">Country</label>
    <select id="id_country" data-widget="filtered-select" data-filter-field="id_continent">
      <option value="">--------</option>
      <option value="1" data-filter-value="3">China</option>
      <option value="2" data-filter-value="2">Egypt</option>
      <option value="3" data-filter-value="1">France</option>
      <option value="4" data-filter-value="1">Germany</option>
      <option value="5" data-filter-value="3">Japan</option>
      <option value="6" data-filter-value="1,3">Russia</option>
      <option value="7" data-filter-value="2">South Africa</option>
      <option value="8" data-filter-value="1,3">Turkey</option>
    </select>
  </div>
*/

import $ from 'jquery';

$(() => {
  // eslint-disable-next-line func-names
  $('[data-widget="filtered-select"]').each(function () {
    const sourceSelect = $('#' + this.dataset.filterField);
    const self = $(this);

    const optionData = [];
    // eslint-disable-next-line func-names
    $('option', this).each(function () {
      let filterValue;
      if ('filterValue' in this.dataset) {
        filterValue = this.dataset.filterValue.split(',');
      } else {
        filterValue = [];
      }

      optionData.push({
        value: this.value,
        label: this.label,
        filterValue: filterValue,
      });
    });

    function updateFromSource() {
      const currentValue = self.val();
      self.empty();
      const chosenFilter = sourceSelect.val();
      let filteredValues;

      if (chosenFilter === '') {
        /* no filter selected - show all options */
        filteredValues = optionData;
      } else {
        filteredValues = [];
        for (let i = 0; i < optionData.length; i += 1) {
          if (
            optionData[i].value === '' ||
            optionData[i].filterValue.indexOf(chosenFilter) !== -1
          ) {
            filteredValues.push(optionData[i]);
          }
        }
      }

      let foundValue = false;
      for (let i = 0; i < filteredValues.length; i += 1) {
        const option = $('<option>');
        option.attr('value', filteredValues[i].value);
        if (filteredValues[i].value === currentValue) foundValue = true;
        option.text(filteredValues[i].label);
        self.append(option);
      }
      if (foundValue) {
        self.val(currentValue);
      } else {
        self.val('');
      }
    }

    updateFromSource();
    sourceSelect.change(updateFromSource);
  });
});

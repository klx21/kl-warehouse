(
  function ($) {

    getList()
      .then(listToMap)
      .then(sortValues)
      .then(map => {
        const keys = Array
          .from(map.keys())
          .sort((a, b) => a - b);
        let groupIndex = 1;

        addListHead(keys);
        keys.forEach(key => {
          appendList(map.get(key), groupIndex++);
        });
      })
      .catch(error => {
        console.error(error);
        renderErrorPage();
      })
      .finally(() => {
        $('#root .loading').hide();
      });

    /**
     *
     * @param {Array<number>} groupIds
     */
    function addListHead(groupIds) {
      const html = [];
      let groupIndex = 1;

      groupIds.forEach(groupId => {
        html.push(`<li class="group-${groupIndex++} col-xl col-lg col-md-12 col-sm-12">`);
        html.push(`Group ID: ${groupId}`);
        html.push('</li>');
      });
      html.push();
      $('#head').append(html.join(''));
    }

    /**
     *
     * @param {Array} items
     * @param {number} groupIndex
     */
    function appendList(items, groupIndex) {
      const html = [`<ul class="col-xl col-lg col-md-6 col-sm-12 list-group list-group-flush">`];
      items.forEach(item => {
        html.push(`<li class="item group-${groupIndex} list-group-item">`);
        html.push(`<i class="far fa-file-alt"></i>`);
        html.push(item.name);
        html.push('</li>');
      });
      html.push('</ul>');
      $('#items').append(html.join(''));
    }

    /**
     *
     */
    function renderErrorPage() {
      const html = ['<div class="row error"><div class="col">'];
      html.push('<i class="fas fa-exclamation-triangle"></i>');
      html.push('Error occurred while retrieving data. Please try again later.');
      html.push('</div></div>');
      $('#root').append(html.join(''));
    }

    /**
     *
     * @return {Promise<Object>}
     */
    function getList() {
      const url = 'http://localhost:3333/api/v1/hiring-list';

      return new Promise((resolve, reject) => {
        $
          .get(url)
          .done(data => {
            try {
              console.log(data);
              resolve(data || []);
            } catch (e) {
              reject(e);
            }
          })
          .fail(error => reject(error));
      });
    }

    /**
     *
     * @param {Array} list
     * @return {Map<number, Array>}
     */
    function listToMap(list) {
      return list.reduce((accu, curr) => {
        if (curr.name) {
          if (!accu.has(curr.listId)) {
            accu.set(curr.listId, []);
          }
          accu
            .get(curr.listId)
            .push(curr);

        }
        return accu;
      }, new Map());
    }

    /**
     *
     * @param {Map} map
     * @return {Map}
     */
    function sortValues(map) {
      map.forEach((values, key, map) => {
        map.set(key, values.sort((a, b) => {
          const numA = parseInt(a.name.split(' ')[1], 10);
          const numB = parseInt(b.name.split(' ')[1], 10);

          return numA - numB;
        }));
      });

      return map;
    }
  }
)($)

import './sources.css';
import { Source, Nullable, ISources } from '../../../utils/types';
import { isType, isNull, isString } from '../../../utils/predicats';
import { getElementInFragment } from '../../../utils/helpers';

enum SourcesSelectors {
  SourseTempSel = '#sourceItemTemp',
  SourseNameSel = '.source__item-name',
  SourseItemSel = '.source__item',
  SourcesSel = '.sources',
}

enum Categories {
  All,
  General,
  Business,
  Entertainment,
  Health,
  Science,
  Sports,
  Technology,
}

class Sources implements ISources {
  public draw(data: Source[]): void {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: Nullable<HTMLTemplateElement> = document.querySelector(SourcesSelectors.SourseTempSel);
    if (!isType<HTMLTemplateElement>(sourceItemTemp, HTMLTemplateElement) || isNull(sourceItemTemp)) {
      throw new Error('sourceItemTemp is not HTMLTemplateElement or equal null');
    }

    data.forEach((item: Readonly<Source>) => {
      const sourceClone: Node = sourceItemTemp.content.cloneNode(true);

      if (!(sourceClone instanceof DocumentFragment)) {
        throw new Error();
      }

      const sourceName = getElementInFragment<HTMLElement>(SourcesSelectors.SourseNameSel, sourceClone);
      const sourceItem = getElementInFragment<HTMLElement>(SourcesSelectors.SourseItemSel, sourceClone);

      sourceName.textContent = item.name;
      sourceItem.setAttribute('data-source-id', item.id);

      fragment.append(sourceClone);
    });

    const sourcesBox: Nullable<HTMLElement> = document.querySelector(SourcesSelectors.SourcesSel);
    if (isNull(sourcesBox)) {
      throw new Error('sourcesBox is null');
    }
    sourcesBox.innerHTML = '';
    sourcesBox.append(fragment);
  }

  public drawCategories(): void {
    const categoriesList: Nullable<HTMLElement> = document.querySelector('.categories-list');
    if (isNull(categoriesList)) {
      throw new Error('categoriesList is null');
    }
    const categories: string[] = Object.values(Categories).filter(isString);
    categories.forEach((category: string, ind: number) => {
      const isChecked = category === 'All' ? 'checked' : '';
      const value = ind === 0 ? '' : category.toLowerCase();

      const labelHTML = `
        <label class="cat-label" for="cat-${ind}">
            <input class="cat-input" type="radio" id="cat-${ind}" value="${value}" name="category-list"  ${isChecked}/>
            ${category}
        </label>
    `;
      categoriesList.insertAdjacentHTML('beforeend', labelHTML);
    });
  }
}

export default Sources;

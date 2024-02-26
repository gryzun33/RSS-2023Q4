import './sources.css';
import { Source, Nullable, ISources } from '../../../types/types';
import { isType, isNull } from '../../../types/predicats';
import { getElementInFragment } from '../../../types/helpers';

enum SourcesSelectors {
  SourseTempSel = '#sourceItemTemp',
  SourseNameSel = '.source__item-name',
  SourseItemSel = '.source__item',
  SourcesSel = '.sources',
}

// type Categories = ['All', 'General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];

// enum Categories {
//   All = '',
//   General = 'general',
//   Business = 'business',
//   Entertainment = 'entertainment',
//   Health = 'health',
//   Science = 'science',
//   Sports = 'sports',
//   Technology = 'technology',
// }

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
  // categories: string[];
  // constructor() {
  //   this.categories = ['All', 'General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
  // }
  public draw(data: Source[]): void {
    console.log('sources=', data);
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

  public drawCategories() {
    const categoriesList: HTMLElement | null = document.querySelector('.categories-list');
    console.log('list=', categoriesList);
    if (isNull(categoriesList)) {
      throw new Error('categoriesList is null');
    }
    const categories: (string | Categories)[] = Object.values(Categories).filter((value) => typeof value === 'string');
    // const categories = new Map(Object.entries(Categories));
    // const categories: Categories;
    // console.log('categories=', categories);
    categories.forEach((category: string | Categories, ind: number) => {
      // console.log('ind=', value);
      const isChecked = category === 'All' ? 'checked' : '';
      if (typeof category !== 'string') {
        throw new Error(`category isn't string`);
      }
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

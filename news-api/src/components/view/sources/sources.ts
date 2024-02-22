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
class Sources implements ISources {
  public draw(data: Source[]): void {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: Nullable<HTMLTemplateElement> = document.querySelector(SourcesSelectors.SourseTempSel);
    if (!isType<HTMLTemplateElement>(sourceItemTemp, HTMLTemplateElement) || isNull(sourceItemTemp)) {
      throw new Error('sourceItemTemp is not HTMLTemplateElement or equal null');
    }

    data.forEach((item: Source) => {
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
    sourcesBox.append(fragment);
  }
}

export default Sources;

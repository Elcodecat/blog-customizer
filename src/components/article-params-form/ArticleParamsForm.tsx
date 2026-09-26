import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { ArticleStateType, OptionType } from '@/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  articleState: ArticleStateType;
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  articleState,
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [formState, setFormState] = useState<ArticleStateType>(articleState);
  const [isSidebarOpen, setIsOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const handleDocumentClick = (event: MouseEvent): void => {
      const target = event.target;

      if (
        target instanceof Node &&
        (formRef.current?.contains(target) || triggerRef.current?.contains(target))
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return (): void => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isSidebarOpen]);

  const handleToggle = (): void => {
    setIsOpen((open) => !open);
  };

  const handleChange =
    (key: keyof ArticleStateType) =>
    (value: OptionType): void => {
      setFormState((state) => ({
        ...state,
        [key]: value,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
    setIsOpen(false);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <>
      <div ref={triggerRef}>
        <ArrowButton isOpen={isSidebarOpen} onClick={handleToggle} />
      </div>

      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isSidebarOpen,
        })}
      >
        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <Text size={31} weight={800}>
            Параметры статьи
          </Text>

          <Select
            title="Шрифт"
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={handleChange('fontFamilyOption')}
          />

          <RadioGroup
            title="Размер шрифта"
            name="font-size"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={handleChange('fontSizeOption')}
          />

          <Separator />

          <Select
            title="Цвет шрифта"
            selected={formState.fontColor}
            options={fontColors}
            onChange={handleChange('fontColor')}
          />

          <Select
            title="Цвет фона"
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={handleChange('backgroundColor')}
          />

          <RadioGroup
            title="Ширина контента"
            name="content-width"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={handleChange('contentWidth')}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};

const { transform } = require('../dist/transform');

it('removes unused import specifiers and import declarations', () => {
  const code = `
  import 'side-effects';
  import unUsedImport from 'package-1';
  import { used, unused } from 'package-2';
  import usedImport from 'package-3';
  import { something as alias } from 'package-4';
  import * as group from 'package-3';
  
  used();
  usedImport();
  alias.method();
  group.property;
  `;

  const result = transform(code);
  expect(result).toMatchSnapshot();
});

it('supports TypeScript React', () => {
  const code = `
  import { PlusCircleOutlined } from "@ant-design/icons";
  import { useQuery } from "@apollo/client";
  import { Card } from "antd";
  import type { NextPage } from "next";
  import { useTranslation } from "react-i18next";
  import { NoDataFound } from "@/NoDataFound";
  
  import { Title } from "@/_layout/Title";
  import { ButtonLink } from "@/ButtonLink";
  import { LoadingOrError } from "@/LoadingOrError";
  import { VideoCard } from "@/VideoCard";
  import { Query, QueryFindFirstUserArgs } from "~/@types/generated/graphqlTypes";
  import { whereIdIs } from "~/front/gql/helpers/graphql.helpers";
  import { ONE_USER_QUERY } from "~/front/gql/queries";
  import { useSession } from "~/front/hooks";
  
  const colProps = {
    md: { span: 12 },
    span: 24,
    xl: { span: 6 },
  };
  
  const VideosPage: NextPage = () => {
    const { user } = useSession();
    const { t } = useTranslation();
  
    const { data } = useQuery<Query, QueryFindFirstUserArgs>(
      ONE_USER_QUERY,
      whereIdIs(user?.id),
    );
  
  
    const userData = data?.findFirstUser;
    if (!userData) {
      return <NoDataFound dataName={String(t("pages.videos.no-datas"))} />;
    }
  
    return (
      <>
       
      </>
    );
  };
  
  export default VideosPage;
  `;

  expect(() => transform(code)).not.toThrow();
  expect(transform(code)).toMatchSnapshot();
});

it('supports decorators', () => {
  const code = `
  import { SomeClass, UnusedClass } from './some-path';

  @injectable()
  export class CustomClass extends SomeClass {
    constructor(@injectMapper() mapper: Mapper) {
      supper(mapper);
    }
  }
  `;

  expect(() => transform(code)).not.toThrow();
  expect(transform(code)).toMatchSnapshot();
});

it('does not remove parameter decorators', () => {
  const code = `
  import { Component, Inject } from '@angular/core';
  import { MAT_DIALOG_DATA } from '@angular/material/dialog';

  @Component({
    template: '',
    styles: ['']
  })
  export class SomeComponent {
    constructor(
      @Inject(MAT_DIALOG_DATA)
      public dialogData
    ) { }
  }
  `;

  expect(() => transform(code)).not.toThrow();
  expect(transform(code)).toMatchSnapshot();
});

it('supports "satisfies" TS keyword', () => {
  const code = `
  type Test = {
    t1: string;
  };
  
  export const TEST_JSON = {
    t1: 't1',
  } satisfies Test;
  `;

  expect(() => transform(code)).not.toThrow();
});

it('preserves specified import identifiers', () => {
  const code = `
  import { React, useState } from 'react';
  import { SomeComponent } from './some-path';

  const App = () => {
    const [count, setCount] = useState(0);

    return <SomeComponent count={count} />;
  };
  `;

  expect(transform(code, ['React'])).toMatchSnapshot();
});

it('preserves imports of JSX type parameters', () => {
  const code = `
  import { SomeComponent } from './some-path';  
  import { SomeType } from './another-path';

  const App = () => {
    return <SomeComponent<SomeType> />;
  };
  `;

  expect(transform(code)).toMatchSnapshot();
});

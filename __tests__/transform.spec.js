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

it('removes unused imports in TypeScript React without crashing', () => {
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

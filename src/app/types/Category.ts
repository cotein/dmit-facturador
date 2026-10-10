export type CategoryRawData = {
    active: boolean;
    attributes: string[] | null;
    code: string;
    company_id: number | null | undefined;
    id: number;
    name: string;
    parent_id: number | null | undefined;
    slug: string | null | undefined;
};

export type Category = CategoryRawData & {
    children: Category[];
};

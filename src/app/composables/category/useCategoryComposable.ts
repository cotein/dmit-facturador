import type { Category } from '../../types/Category';
import { useQuery } from '@tanstack/vue-query';
import { getCategories } from '@/api/category/category-api';
import type { AxiosResponse } from 'axios';
import { useCategoryStore } from '@/app/store/category/useCategoryStore';
import { storeToRefs } from 'pinia';

const { CategoriesGetter, rawCategories } = storeToRefs(useCategoryStore());
const { setCategories } = useCategoryStore();

const transform_categories = (data: Category[]) => {
    data.sort((a, b) => {
        if (a.parent_id === null) {
            return -1; // Coloca los elementos sin parent_id al principio
        } else if (b.parent_id === null) {
            return 1; // Coloca los elementos sin parent_id al principio
        } else {
            return a.parent_id - b.parent_id; // Ordena por parent_id de menor a mayor
        }
    });
    const categories_list = parentsCategories(data);

    return categories_list;
};

const parentsCategories = (categories: Category[]) => {
    const arr: any = [];

    categories.map((category: Category) => {
        if (category.parent_id == null) {
            arr.push({
                id: category.id,
                parent_id: category.parent_id,
                name: category.name,
                slug: category.slug,
                code: category.code,
                active: category.active,
                attributes: category.attributes,
                company_id: category.company_id,
                children: [],
            });
        }

        childCategories(arr, category);
    });

    return arr;
};

const childCategories = (arr: Category[], cat: Category) => {
    arr.map((el: any) => {
        if (el.id == cat.parent_id) {
            el.children.push({
                id: cat.id,
                parent_id: cat.parent_id,
                name: cat.name,
                slug: cat.slug,
                code: cat.code,
                active: cat.active,
                attributes: cat.attributes,
                company_id: cat.company_id,
                children: [],
            });
        } else {
            childCategories(el.children, cat);
        }
    });
};
export const useCategoryComposable = () => {
    const fetchCategories = (company_id: any, category_id: any) => {
        return useQuery(['categories', company_id, category_id], () => getCategories(company_id, category_id), {
            onSuccess(data: AxiosResponse<Category[]>) {
                const { data: categories } = data;
                rawCategories.value = categories;
                setCategories(transform_categories(categories));
            },
        });
    };

    return {
        fetchCategories,
        CategoriesGetter,
        transform_categories,
        setCategories,
        rawCategories,
    };
};

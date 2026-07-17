import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; // Breadcrumb components
import CoursesList from '@/components/_main/courses'; // CoursesList components

export const revalidate = 60;
const baseUrl = process.env.BASE_URL;

export async function generateStaticParams() {
  const res = await fetch(`${baseUrl}/api/sub-categories-slugs`, {
    next: { revalidate: 3600 }, // Cache slug list for 1 hour
  });

  const { data } = await res.json();

  return (
    data?.map((sub) => ({
      subCategory: sub.slug,
    })) || []
  );
}

export async function generateMetadata({ params }) {
  const { subCategory } = await params;

  const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
    cache: 'force-cache', // Prefer cached
  });

  const { data: currentCategory } = await res.json();

  if (!currentCategory) return {};

  return {
    title: currentCategory.metaTitle || currentCategory.name,
    description: currentCategory.metaDescription || currentCategory.description,
    openGraph: {
      title: currentCategory.name,
      description:
        currentCategory.metaDescription || currentCategory.description,
    },
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const { category, subCategory } = params;

  const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  const response = await res.json();

  const res2 = await fetch(
    `${baseUrl}/api/filters/${category}/${subCategory}`,
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );
  const response2 = await res2.json();
  const { data: subCategoryData } = response;
  const { filters } = response2;
  console.log(subCategoryData, response2);
  return (
    <div className='layout-container py-4 md:py-9'>
      <div>
        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold font-merriweather tracking-wide text-foreground mb-2'>
          {subCategoryData?.name}
        </h1>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Pradžia</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/courses'>Kursai</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/courses/${category}`}>
                {decodeURIComponent(subCategoryData?.parentCategory?.name || category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {decodeURIComponent(subCategoryData?.name || subCategory)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Courses List Component */}
      <CoursesList
        subCategories={subCategoryData}
        filters={filters}
      />
    </div>
  );
}

"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { categoryService, CategoryData } from "@/services/online-services/categoryService";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export const CategorySubcategory = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [categoryData, setCategoryData] = React.useState<CategoryData[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [uniqueCategories, setUniqueCategories] = React.useState<string[]>([]);
  const [uniqueSubcategories, setUniqueSubcategories] = React.useState<
    string[]
  >([]);

  // Fetch categories from API
  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Build search query that includes category and subcategory filters
      let searchQuery = searchTerm;
      if (categoryFilter !== "all" && !searchTerm) {
        searchQuery = categoryFilter;
      }
      if (subcategoryFilter !== "all" && !searchTerm) {
        searchQuery = subcategoryFilter;
      }

      const response = await categoryService.getCategories({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        categoryStatus: statusFilter === "all" ? undefined : statusFilter,
        subcategoryStatus: statusFilter === "all" ? undefined : statusFilter,
      });

      setCategoryData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);

      // Extract unique categories and subcategories for filters
      const categories = [
        ...new Set(response.data.map((item) => item.categoryName)),
      ];
      const subcategories = [
        ...new Set(
          response.data.map((item) => item.subcategoryName).filter(Boolean)
        ),
      ];
      setUniqueCategories(categories);
      setUniqueSubcategories(subcategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [
    categoryFilter,
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    subcategoryFilter,
  ]);

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchCategories]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    categoryFilter,
    subcategoryFilter,
    statusFilter,
    itemsPerPage,
  ]);

  // Get filtered subcategories based on selected category
  const filteredSubcategories = React.useMemo(() => {
    if (categoryFilter === "all") {
      return uniqueSubcategories;
    }

    // Filter subcategories to show only those belonging to the selected category
    const categorySubcategories = categoryData
      .filter((item) => item.categoryName === categoryFilter)
      .map((item) => item.subcategoryName)
      .filter(Boolean);

    return [...new Set(categorySubcategories)];
  }, [categoryData, categoryFilter, uniqueSubcategories]);

  // Reset subcategory filter when category filter changes
  React.useEffect(() => {
    if (categoryFilter !== "all" && subcategoryFilter !== "all") {
      // Check if current subcategory filter is still valid for the selected category
      const isSubcategoryValid =
        filteredSubcategories.includes(subcategoryFilter);
      if (!isSubcategoryValid) {
        setSubcategoryFilter("all");
      }
    }
  }, [categoryFilter, subcategoryFilter, filteredSubcategories]);

  // Use server-side pagination data directly
  const paginatedData = categoryData;
  const filteredTotalPages = totalPages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPagesToUse = totalPages;

    if (totalPagesToUse <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesToUse; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPagesToUse);
      } else if (currentPage >= totalPagesToUse - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPagesToUse - 3; i <= totalPagesToUse; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPagesToUse);
      }
    }

    return pages;
  };

  const handleToggleCategoryStatus = async (id: string) => {
    try {
      await categoryService.toggleCategoryStatus(id, "category");
      toast.success("Category status updated successfully");
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");
    }
  };

  const handleToggleSubcategoryStatus = async (id: string) => {
    try {
      // Check if this is a composite ID (category-subcategory)
      if (!id.includes("-")) {
        toast.error("Cannot toggle subcategory status: Invalid ID format");
        return;
      }

      await categoryService.toggleCategoryStatus(id, "subcategory");
      toast.success("Subcategory status updated successfully");
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error("Error updating subcategory status:", error);
      const errorMessage = (() => {
        if (error instanceof Error && "response" in error) {
          const axiosError = error as Error & {
            response?: {
              data?: {
                message?: string;
              };
            };
          };
          return (
            axiosError.response?.data?.message ||
            "Failed to update subcategory status"
          );
        }
        return "Failed to update subcategory status";
      })();
      toast.error(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/products-list/category-list/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/products-list/category-list/view/${id}`);
  };

  const handleAddCategory = () => {
    router.push("/dashboard/products-list/category-list/add-category");
  };

  return (
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm sm:text-base"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subcategory Filter - Hidden on mobile */}
          <Select
            value={subcategoryFilter}
            onValueChange={setSubcategoryFilter}
          >
            <SelectTrigger className="hidden sm:flex w-[180px] text-sm">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {filteredSubcategories.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter - Hidden on mobile */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="hidden sm:flex w-[140px] text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(searchTerm ||
            categoryFilter !== "all" ||
            subcategoryFilter !== "all" ||
            statusFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setSubcategoryFilter("all");
                setStatusFilter("all");
              }}
              className="hidden sm:flex text-sm"
              size="sm"
            >
              Clear Filters
            </Button>
          )}

          <Button
            onClick={handleAddCategory}
            className="w-full sm:w-auto text-sm"
            size="sm"
          >
            <Plus className="size-4 mr-1" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Mobile Filters - Show subcategory and status on mobile */}
      <div className="sm:hidden flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={subcategoryFilter}
            onValueChange={setSubcategoryFilter}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {filteredSubcategories.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters on Mobile */}
        {(searchTerm ||
          categoryFilter !== "all" ||
          subcategoryFilter !== "all" ||
          statusFilter !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setSubcategoryFilter("all");
              setStatusFilter("all");
            }}
            className="w-full text-sm"
            size="sm"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden lg:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Category</TableHead>
              <TableHead className="min-w-[150px]">Subcategory</TableHead>
              <TableHead className="min-w-[100px]">Images</TableHead>
              <TableHead className="min-w-[200px]">SEO Keywords</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[100px]">Created</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading categories...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ||
                    categoryFilter !== "all" ||
                    subcategoryFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No categories found matching your filters."
                      : "No categories available."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {/* Category */}
                  <TableCell className="font-medium">
                    <div>
                      <div>{item.categoryName}</div>
                      {item.categoryMetaTitle && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.categoryMetaTitle}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Subcategory */}
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.subcategoryName}</div>
                      {item.subcategoryMetaTitle && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.subcategoryMetaTitle}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Images */}
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="size-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                        {item.categoryImage ? (
                          <Image
                            src={item.categoryImage}
                            alt={item.categoryName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="size-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                        {item.subcategoryImage ? (
                          <Image
                            src={item.subcategoryImage}
                            alt={item.subcategoryName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* SEO Keywords */}
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      {item.categoryMetaKeywords && (
                        <div className="text-muted-foreground">
                          <span className="font-medium">Cat:</span>{" "}
                          {item.categoryMetaKeywords
                            .split(",")
                            .slice(0, 2)
                            .join(", ")}
                          {item.categoryMetaKeywords.split(",").length > 2 &&
                            "..."}
                        </div>
                      )}
                      {item.subcategoryMetaKeywords && (
                        <div className="text-muted-foreground">
                          <span className="font-medium">Sub:</span>{" "}
                          {item.subcategoryMetaKeywords
                            .split(",")
                            .slice(0, 2)
                            .join(", ")}
                          {item.subcategoryMetaKeywords.split(",").length > 2 &&
                            "..."}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          item.categoryIsActive ? "default" : "secondary"
                        }
                        className="w-fit cursor-pointer"
                        onClick={() => handleToggleCategoryStatus(item.id)}
                      >
                        Cat: {item.categoryIsActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge
                        variant={
                          item.subcategoryIsActive ? "default" : "secondary"
                        }
                        className="w-fit cursor-pointer"
                        onClick={() => handleToggleSubcategoryStatus(item.id)}
                      >
                        Sub: {item.subcategoryIsActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleView(item.id)}
                        title="View details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEdit(item.id)}
                        title="Edit"
                      >
                        <Edit className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <ImageIcon className="size-16 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground text-center px-4">
              {searchTerm ||
              categoryFilter !== "all" ||
              subcategoryFilter !== "all" ||
              statusFilter !== "all"
                ? "No categories found matching your filters."
                : "No categories available."}
            </p>
          </div>
        ) : (
          paginatedData.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Header with Images */}
                <div className="flex items-start gap-3">
                  {/* Images */}
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="size-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {item.categoryImage ? (
                        <Image
                          src={item.categoryImage}
                          alt={item.categoryName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="size-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {item.subcategoryImage ? (
                        <Image
                          src={item.subcategoryImage}
                          alt={item.subcategoryName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Category and Subcategory Names */}
                  <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                      <div>
                        <h3 className="font-semibold text-sm">{item.categoryName}</h3>
                        {item.categoryMetaTitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {item.categoryMetaTitle}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">
                          {item.subcategoryName}
                        </h4>
                        {item.subcategoryMetaTitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {item.subcategoryMetaTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Keywords */}
                {(item.categoryMetaKeywords || item.subcategoryMetaKeywords) && (
                  <div className="space-y-1 text-xs border-t pt-2">
                    {item.categoryMetaKeywords && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Category:</span>{" "}
                        {item.categoryMetaKeywords.split(",").slice(0, 3).join(", ")}
                        {item.categoryMetaKeywords.split(",").length > 3 && "..."}
                      </div>
                    )}
                    {item.subcategoryMetaKeywords && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Subcategory:</span>{" "}
                        {item.subcategoryMetaKeywords.split(",").slice(0, 3).join(", ")}
                        {item.subcategoryMetaKeywords.split(",").length > 3 && "..."}
                      </div>
                    )}
                  </div>
                )}

                {/* Status Badges and Date */}
                <div className="flex items-center justify-between gap-2 border-t pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={item.categoryIsActive ? "default" : "secondary"}
                      className="text-xs cursor-pointer"
                      onClick={() => handleToggleCategoryStatus(item.id)}
                    >
                      Cat: {item.categoryIsActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant={item.subcategoryIsActive ? "default" : "secondary"}
                      className="text-xs cursor-pointer"
                      onClick={() => handleToggleSubcategoryStatus(item.id)}
                    >
                      Sub: {item.subcategoryIsActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(item.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <Eye className="size-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <Edit className="size-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2">
          {/* Results Info and Items Per Page */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {totalCount === 0 ? 0 : startIndex + 1}-{endIndex} of {totalCount}
            </div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[90px] sm:w-[100px] text-xs sm:text-sm h-8 sm:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="mx-0 w-full sm:w-auto">
              <PaginationContent className="flex-wrap gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={`h-8 sm:h-9 text-xs sm:text-sm ${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>

                {/* Desktop: Show all page numbers */}
                <div className="hidden sm:contents">
                  {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page as number);
                          }}
                          isActive={currentPage === page}
                          className="h-9 text-sm"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                </div>

                {/* Mobile: Show only current page indicator */}
                <div className="sm:hidden flex items-center gap-1">
                  <span className="text-xs text-muted-foreground px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < filteredTotalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={`h-8 sm:h-9 text-xs sm:text-sm ${
                      currentPage === filteredTotalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

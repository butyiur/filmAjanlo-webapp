package hu.attila.filmajanlo.controller;

import hu.attila.filmajanlo.model.Category;
import hu.attila.filmajanlo.service.CategoryService;
import hu.attila.filmajanlo.service.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    // --- Összes kategória lekérése ---
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }

    // --- Egy kategória lekérése ---
    @GetMapping("/{id}")
    public Category getCategory(@PathVariable Long id) {
        return categoryService.findById(id);
    }

    // --- Új kategória létrehozása (ADMIN) ---
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
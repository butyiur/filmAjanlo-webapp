package hu.attila.filmajanlo.service;

import hu.attila.filmajanlo.model.Category;
import hu.attila.filmajanlo.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public Category save(Category category) {
        // --- Duplikált név ellenőrzés ---
        boolean exists = categoryRepository.findAll().stream()
                .anyMatch(c -> c.getName().equalsIgnoreCase(category.getName()));

        if (exists) {
            throw new RuntimeException("Category with this name already exists: " + category.getName());
        }

        return categoryRepository.save(category);
    }

    @Override
    public void delete(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // --- Az adott kategóriához tartozó filmek leválasztása ---
        category.getMovies().forEach(movie -> movie.setCategory(null));

        // --- Ezután törölhetjük a kategóriát ---
        categoryRepository.delete(category);
    }
}
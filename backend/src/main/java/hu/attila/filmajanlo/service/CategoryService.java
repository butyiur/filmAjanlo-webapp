package hu.attila.filmajanlo.service;

import hu.attila.filmajanlo.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();
    Category findById(Long id);
    Category save(Category category);
}
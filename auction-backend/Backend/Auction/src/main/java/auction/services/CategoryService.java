package auction.services;

import auction.entities.Category;
import auction.entities.utils.MessageUtils;
import auction.exceptions.ServiceException;
import auction.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        try {
            return categoryRepository.findAll();
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.retrieveError("Categories"), e);
        }
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() ->
                new ServiceException(MessageUtils.notFound("Category"), new RuntimeException("Category not found")));
    }


    public Category getByName(String name) {
        return categoryRepository.findByName(name).orElseThrow(() ->
                new ServiceException(MessageUtils.notFound("Category"), new RuntimeException("Category not found")));
    }

    @Transactional
    public void save(Category category) {
        try {
            categoryRepository.save(category);
            log.info(MessageUtils.saveSuccess("Category"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.saveError("Category"), e);
        }
    }

    @Transactional
    public void update(Long id, Category categoryDetails) {
        try {
            Category existingCategory = getById(id);
            existingCategory.setName(categoryDetails.getName());
            categoryRepository.save(existingCategory);
            log.info(MessageUtils.updateSuccess("Category"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.updateError("Category"), e);
        }
    }

    @Transactional
    public void delete(Long id) {
        try {
            Category category = getById(id);
            categoryRepository.delete(category);
            log.info(MessageUtils.deleteSuccess("Category"));
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.deleteError("Category"), e);
        }
    }
}



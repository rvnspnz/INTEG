package auction.entities.RO;

import auction.entities.Category;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRO {
    private Long id;
    private String name;

    public Category toEntity() {
        return Category.builder()
                .id(this.id)
                .name(this.name)
                .build();
    }
}
